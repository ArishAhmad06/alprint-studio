import type { Models } from "../../prisma/schema.js";
import type { OtpPurpose, UserRecord , UserSessionRecord} from "./auth.types.js";

export interface IAuthRepository {
  findUserByIdentifier(identifier: string): Promise<UserRecord | null>;

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

  incrementOtpAttempts(otpId: string): Promise<void>;

  markOtpAsVerified(otpId: string): Promise<void>;

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
  }): Promise<UserRecord>;

  createSession(data: {
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
  }): Promise<UserSessionRecord>;

  findSessionByRefreshTokenHash(
    refreshTokenHash: string,
  ): Promise<UserSessionRecord | null>;

  revokeSession(sessionId: string): Promise<void>;
}
