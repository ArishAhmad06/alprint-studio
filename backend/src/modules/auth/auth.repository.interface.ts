import type { Models } from "../../prisma/schema.js";
import type { OtpPurpose } from "./auth.types.js";

export interface IAuthRepository {
  findUserByIdentifier(identifier: string): Promise<Models.public_User | null>;

  createSignupAttempt(data: {
    name: string;
    email?: string;
    phone?: string;
    passwordHash: string;
    expiresAt: Date;
  }): Promise<Models.public_SignupAttempt>;

  invalidatePreviousOtp(identifier: string, purpose: OtpPurpose): Promise<void>;

  createOtpVerification(data: {
    identifier: string;
    otpHash: string;
    purpose: OtpPurpose;
    expiresAt: Date;
  }): Promise<void>;

  
}
