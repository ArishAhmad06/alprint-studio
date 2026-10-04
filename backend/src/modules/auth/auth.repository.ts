import type { Models } from "../../prisma/schema.js";
import { db } from "../../prisma/db.js";

import type { IAuthRepository } from "./auth.repository.interface.js";
import type { OtpPurpose } from "./auth.types.js";

export class AuthRepository implements IAuthRepository {
  async findUserByIdentifier(identifier: string) {
    return null;
  }

  async createSignupAttempt(data: {
    name: string;
    email?: string;
    phone?: string;
    passwordHash: string;
    expiresAt: Date;
  }): Promise<Models.public_SignupAttempt> {
    const signupAttempt = await db.orm.public.SignupAttempt.create(data);
    return signupAttempt;
  }

  async invalidatePreviousOtp(
    identifier: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    await db.orm.public.OtpVerification.where({
      identifier,
      purpose,
      verifiedAt: null,
    }).updateAll({
      verifiedAt: new Date(),
    });
  }

  async createOtpVerification(data: {
    identifier: string;
    otpHash: string;
    purpose: OtpPurpose;
    expiresAt: Date;
  }): Promise<void> {
    await db.orm.public.OtpVerification.create(data);
  }
}
