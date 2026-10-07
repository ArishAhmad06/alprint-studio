import crypto from "node:crypto";
import {
  signupSchema,
  verifySignupOtpSchema,
  loginSchema,
} from "./auth.schema.js";
import type { IAuthRepository } from "./auth.repository.interface.js";
import { hashPassword, verifyPassword } from "../../shared/utils/password.js";
import { generateOtp, hashOtp } from "../../shared/utils/otp.js";
import { fromInstant } from "../../shared/utils/temporal.js";
import type { IOtpProvider } from "../../infrastructure/otp/otp.provider.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "../../shared/utils/token.js";

export class AuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly otpProvider: IOtpProvider,
  ) {}

  async signup(input: unknown) {
    const data = signupSchema.parse(input);

    const identifier = data.email ?? data.phone!;

    const existingUser =
      await this.authRepository.findUserByIdentifier(identifier);

    if (existingUser) {
      throw new Error("User already exists");
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
    const otpHash = hashOtp(otp);

    await this.authRepository.invalidatePreviousOtp(identifier, "SIGNUP");

    await this.authRepository.createOtpVerification({
      identifier,
      otpHash,
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
      throw new Error("OTP not found");
    }

    if (fromInstant(otpRecord.expiresAt) < new Date()) {
      throw new Error("OTP expired");
    }

    if (otpRecord.attempts >= 5) {
      throw new Error("Too many OTP attempts");
    }

    const submitted = Buffer.from(hashOtp(data.otp), "hex");
    const stored = Buffer.from(otpRecord.otpHash, "hex");
    const isValid =
      submitted.length === stored.length &&
      crypto.timingSafeEqual(submitted, stored);

    if (!isValid) {
      await this.authRepository.incrementOtpAttempts(otpRecord.id);
      throw new Error("Invalid OTP");
    }

    const signupAttempt =
      await this.authRepository.findSignupAttemptByIdentifier(data.identifier);

    if (!signupAttempt) {
      throw new Error("Signup attempt not found");
    }

    if (fromInstant(signupAttempt.expiresAt) < new Date()) {
      throw new Error("Signup attempt expired");
    }

    const user = await this.authRepository.completeSignupVerification({
      otpId: otpRecord.id,
      identifier: data.identifier,
      name: signupAttempt.name,
      email: signupAttempt.email ?? undefined,
      phone: signupAttempt.phone ?? undefined,
      passwordHash: signupAttempt.passwordHash,
    });

    return {
      message: "Signup completed successfully",
      userId: user.id,
    };
  }

  // login service
  async login(input: unknown) {
    const data = loginSchema.parse(input);

    const identifier = data.email ?? data.phone!;

    const user = await this.authRepository.findUserByIdentifier(identifier);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (user.status !== "ACTIVE") {
      throw new Error("Account is not active");
    }

    if (!user.passwordHash) {
      throw new Error("Password login is not available for this account");
    }

    const isPasswordValid = await verifyPassword(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const refreshToken = generateRefreshToken();

    const refreshTokenHash = hashRefreshToken(refreshToken);

    const refreshTokenExpiresAt = new Date(
      Date.now() +
        Number(process.env["JWT_REFRESH_TOKEN_EXPIRY"] ?? "30") *
          24 *
          60 *
          60 *
          1000,
    );

    const session = await this.authRepository.createSession({
      userId: user.id,
      refreshTokenHash,
      expiresAt: refreshTokenExpiresAt,
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
}
