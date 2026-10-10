import type { Models } from "../../prisma/schema.js";
import type {
  OtpPurpose,
  UserRecord,
  UserSessionRecord,
} from "./auth.types.js";

export interface IAuthRepository {
  findUserByIdentifier(identifier: string): Promise<UserRecord | null>;

  findUserById(id: string): Promise<UserRecord | null>;

  createSignupAttempt(data: {
    name: string;
    email?: string | undefined;
    phone?: string | undefined;
    passwordHash: string;
    expiresAt: Date;
  }): Promise<Models.public_SignupAttempt>;

  findSignupAttemptByIdentifier(
    identifier: string,
  ): Promise<Models.public_SignupAttempt | null>;

  findOtpVerification(
    identifier: string,
    purpose: OtpPurpose,
  ): Promise<Models.public_OtpVerification | null>;

  claimOtpAttempt(otpId: string, currentAttempts: number): Promise<boolean>;
  
  consumeOtp(otpId: string): Promise<boolean>;

  invalidatePreviousOtp(identifier: string, purpose: OtpPurpose): Promise<void>;

  createOtpVerification(data: {
    identifier: string;
    otpHash: string;
    purpose: OtpPurpose;
    expiresAt: Date;
  }): Promise<void>;

  createUser(data: {
    name: string;
    email?: string | undefined;
    phone?: string | undefined;
    passwordHash: string;
  }): Promise<UserRecord>;

  deleteSignupAttemptByIdentifier(identifier: string): Promise<void>;

  completeSignupVerification(data: {
    otpId: string;
    identifier: string;
    name: string;
    email?: string | undefined;
    phone?: string | undefined;
    passwordHash: string;
  }): Promise<UserRecord | null>;

  createSession(data: {
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
  }): Promise<UserSessionRecord>;

  rotateRefreshSession(data: {
    sessionId: string;
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
  }): Promise<UserSessionRecord | null>;

  findSessionByRefreshTokenHash(
    refreshTokenHash: string,
  ): Promise<UserSessionRecord | null>;

  findActiveSessionById(sessionId: string): Promise<UserSessionRecord | null>;

  updateSessionLastUsedAt(sessionId: string): Promise<void>;

  revokeSession(sessionId: string): Promise<void>;

  revokeAllUserSessions(userId: string): Promise<void>;
}
