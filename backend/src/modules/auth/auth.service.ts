import crypto from "node:crypto";
import { env } from "../../config/env.js";

import {
  signupSchema,
  verifySignupOtpSchema,
  loginSchema,
  refreshTokenSchema,
  requestLoginOtpSchema,
  verifyLoginOtpSchema,
} from "./auth.schema.js";

import type { IAuthRepository } from "./auth.repository.interface.js";

import { hashPassword, verifyPassword } from "../../shared/utils/password.js";

import { generateOtp, hashOtp } from "../../shared/utils/otp.js";

import { fromInstant } from "../../shared/utils/temporal.js";

import type { IOtpProvider } from "../../infrastructure/otp/otp.provider.js";
import type { OtpPurpose } from "./auth.types.js";

import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "../../shared/utils/token.js";

import { AppError } from "../../common/http/errors/app-error.js";

const REFRESH_REUSE_GRACE_MS = 10_000;
const MAX_OTP_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 60_000;

export class AuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly otpProvider: IOtpProvider,
  ) {}

  private verifyOtpHash(submittedOtp: string, storedOtpHash: string): boolean {
    const submitted = Buffer.from(hashOtp(submittedOtp), "hex");
    const stored = Buffer.from(storedOtpHash, "hex");

    return (
      submitted.length === stored.length &&
      crypto.timingSafeEqual(submitted, stored)
    );
  }

  private getRefreshTokenExpiry(): Date {
    return new Date(
      Date.now() + env.JWT_REFRESH_TOKEN_EXPIRY * 24 * 60 * 60 * 1000,
    );
  }

  private async claimOtpAttempt(otpRecord: {
    id: string;
    attempts: number;
  }): Promise<void> {
    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      throw new AppError(429, "OTP_ATTEMPTS_EXCEEDED", "Too many OTP attempts");
    }

    const claimed = await this.authRepository.claimOtpAttempt(
      otpRecord.id,
      otpRecord.attempts,
    );

    if (!claimed) {
      throw new AppError(
        429,
        "OTP_ATTEMPT_CONFLICT",
        "Too many simultaneous attempts, please try again",
      );
    }
  }

  private async isOtpCoolingDown(
    identifier: string,
    purpose: OtpPurpose,
  ): Promise<boolean> {
    const active = await this.authRepository.findOtpVerification(
      identifier,
      purpose,
    );

    return (
      active !== null &&
      Date.now() - fromInstant(active.createdAt).getTime() <
        OTP_RESEND_COOLDOWN_MS
    );
  }

  async signup(input: unknown) {
    const data = signupSchema.parse(input);
    const identifier = data.email ?? data.phone!;

    const existingUser =
      await this.authRepository.findUserByIdentifier(identifier);

    if (existingUser) {
      throw new AppError(409, "USER_ALREADY_EXISTS", "User already exists");
    }

    if (await this.isOtpCoolingDown(identifier, "SIGNUP")) {
      throw new AppError(
        429,
        "OTP_COOLDOWN",
        "Please wait a minute before requesting another OTP",
      );
    }

    const passwordHash = await hashPassword(data.password);

    await this.authRepository.deleteSignupAttemptByIdentifier(identifier);

    await this.authRepository.createSignupAttempt({
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const otp = generateOtp();

    await this.authRepository.invalidatePreviousOtp(identifier, "SIGNUP");

    await this.authRepository.createOtpVerification({
      identifier,
      otpHash: hashOtp(otp),
      purpose: "SIGNUP",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await this.otpProvider.sendOtp(identifier, otp);

    return {
      message: "Otp sent successfully",
    };
  }

  async verifySignupOtp(input: unknown) {
    const data = verifySignupOtpSchema.parse(input);

    const otpRecord = await this.authRepository.findOtpVerification(
      data.identifier,
      "SIGNUP",
    );

    if (!otpRecord) {
      throw new AppError(400, "OTP_NOT_FOUND", "OTP not found");
    }

    if (fromInstant(otpRecord.expiresAt) <= new Date()) {
      throw new AppError(400, "OTP_EXPIRED", "OTP expired");
    }

    await this.claimOtpAttempt(otpRecord);

    if (!this.verifyOtpHash(data.otp, otpRecord.otpHash)) {
      throw new AppError(400, "INVALID_OTP", "Invalid OTP");
    }

    const signupAttempt =
      await this.authRepository.findSignupAttemptByIdentifier(data.identifier);

    if (!signupAttempt) {
      throw new AppError(
        400,
        "SIGNUP_ATTEMPT_NOT_FOUND",
        "Signup attempt not found",
      );
    }

    if (fromInstant(signupAttempt.expiresAt) <= new Date()) {
      throw new AppError(
        400,
        "SIGNUP_ATTEMPT_EXPIRED",
        "Signup attempt expired",
      );
    }

    const user = await this.authRepository.completeSignupVerification({
      otpId: otpRecord.id,
      identifier: data.identifier,
      name: signupAttempt.name,
      email: signupAttempt.email ?? undefined,
      phone: signupAttempt.phone ?? undefined,
      passwordHash: signupAttempt.passwordHash,
    });

    if (!user) {
      throw new AppError(
        400,
        "OTP_ALREADY_USED",
        "OTP is invalid or has already been used",
      );
    }

    return {
      message: "Signup completed successfully",
      userId: user.id,
    };
  }

  async login(input: unknown) {
    const data = loginSchema.parse(input);
    const identifier = data.email ?? data.phone!;

    const user = await this.authRepository.findUserByIdentifier(identifier);

    // Always runs a bcrypt compare, even for unknown users, to keep timing equal.
    const isPasswordValid = await verifyPassword(
      data.password,
      user?.passwordHash ?? null,
    );

    if (!user || !isPasswordValid) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid credentials");
    }

    if (user.status !== "ACTIVE") {
      throw new AppError(403, "ACCOUNT_NOT_ACTIVE", "Account is not active");
    }

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const session = await this.authRepository.createSession({
      userId: user.id,
      refreshTokenHash,
      expiresAt: this.getRefreshTokenExpiry(),
    });

    const accessToken = await generateAccessToken({
      userId: user.id,
      sessionId: session.id,
    });

    return {
      message: "Login successful",
      accessToken,
      refreshToken,
    };
  }

  async requestLoginOtp(input: unknown) {
    const data = requestLoginOtpSchema.parse(input);
    const identifier = data.email ?? data.phone!;

    // Same response whether or not the account exists.
    const response = {
      message: "If an account exists, an OTP has been sent",
    };

    const user = await this.authRepository.findUserByIdentifier(identifier);

    if (!user || user.status !== "ACTIVE") {
      return response;
    }

    // Cooling down returns the same response too, so repeating the request reveals nothing.
    if (await this.isOtpCoolingDown(identifier, "LOGIN")) {
      return response;
    }

    const otp = generateOtp();

    await this.authRepository.invalidatePreviousOtp(identifier, "LOGIN");

    await this.authRepository.createOtpVerification({
      identifier,
      otpHash: hashOtp(otp),
      purpose: "LOGIN",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await this.otpProvider.sendOtp(identifier, otp);

    return response;
  }

  async verifyLoginOtp(input: unknown) {
    const data = verifyLoginOtpSchema.parse(input);

    const otpRecord = await this.authRepository.findOtpVerification(
      data.identifier,
      "LOGIN",
    );

    if (!otpRecord) {
      throw new AppError(400, "OTP_NOT_FOUND", "OTP not found");
    }

    if (fromInstant(otpRecord.expiresAt) <= new Date()) {
      throw new AppError(400, "OTP_EXPIRED", "OTP expired");
    }

    await this.claimOtpAttempt(otpRecord);

    if (!this.verifyOtpHash(data.otp, otpRecord.otpHash)) {
      throw new AppError(400, "INVALID_OTP", "Invalid OTP");
    }

    const user = await this.authRepository.findUserByIdentifier(
      data.identifier,
    );

    if (!user) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid credentials");
    }

    if (user.status !== "ACTIVE") {
      throw new AppError(403, "ACCOUNT_NOT_ACTIVE", "Account is not active");
    }

    // Atomically attempt to consume the OTP before creating a session.
    const consumed = await this.authRepository.consumeOtp(otpRecord.id);

    if (!consumed) {
      throw new AppError(
        400,
        "OTP_ALREADY_USED",
        "OTP is invalid or has already been used",
      );
    }

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const session = await this.authRepository.createSession({
      userId: user.id,
      refreshTokenHash,
      expiresAt: this.getRefreshTokenExpiry(),
    });

    const accessToken = await generateAccessToken({
      userId: user.id,
      sessionId: session.id,
    });

    return {
      message: "Login successful",
      accessToken,
      refreshToken,
    };
  }

  async refresh(input: unknown) {
    const data = refreshTokenSchema.parse(input);
    const refreshTokenHash = hashRefreshToken(data.refreshToken);

    const session =
      await this.authRepository.findSessionByRefreshTokenHash(refreshTokenHash);

    if (!session) {
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
    }

    if (session.revokedAt) {
      // An already-rotated or logged-out token is being used again.
      // After the grace window, assume it was stolen and end every session.
      const revokedMsAgo =
        Date.now() - fromInstant(session.revokedAt).getTime();

      if (revokedMsAgo > REFRESH_REUSE_GRACE_MS) {
        await this.authRepository.revokeAllUserSessions(session.userId);
      }

      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
    }

    if (fromInstant(session.expiresAt) <= new Date()) {
      throw new AppError(401, "REFRESH_TOKEN_EXPIRED", "Refresh token expired");
    }

    const user = await this.authRepository.findUserById(session.userId);

    if (!user || user.status !== "ACTIVE") {
      await this.authRepository.revokeAllUserSessions(session.userId);
      throw new AppError(403, "ACCOUNT_NOT_ACTIVE", "Account is not active");
    }

    const newRefreshToken = generateRefreshToken();
    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    const newSession = await this.authRepository.rotateRefreshSession({
      sessionId: session.id,
      userId: session.userId,
      refreshTokenHash: newRefreshTokenHash,
      expiresAt: this.getRefreshTokenExpiry(),
    });

    if (!newSession) {
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
    }

    const accessToken = await generateAccessToken({
      userId: session.userId,
      sessionId: newSession.id,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async validateAccessSession(
    userId: string,
    sessionId: string,
  ): Promise<void> {
    const session = await this.authRepository.findActiveSessionById(sessionId);

    if (
      !session ||
      session.userId !== userId ||
      fromInstant(session.expiresAt) <= new Date()
    ) {
      throw new AppError(
        401,
        "SESSION_EXPIRED",
        "Session expired, please log in again",
      );
    }

    const user = await this.authRepository.findUserById(userId);

    if (!user || user.status !== "ACTIVE") {
      throw new AppError(403, "ACCOUNT_NOT_ACTIVE", "Account is not active");
    }
  }

  async logout(sessionId: string): Promise<void> {
    await this.authRepository.revokeSession(sessionId);
  }
}