import type { Models } from "../../prisma/schema.js";
import { db } from "../../prisma/db.js";
import { or } from "@prisma/orm-postgres/orm-client";
import { toInstant } from "../../shared/utils/temporal.js";

import type { IAuthRepository } from "./auth.repository.interface.js";
import type { OtpPurpose } from "./auth.types.js";

export class AuthRepository implements IAuthRepository {
  async findUserByIdentifier(identifier: string) {
    return await db.orm.public.User.where((user) =>
      or(user.email.eq(identifier), user.phone.eq(identifier)),
    ).first();
  }

  async createSignupAttempt(data: {
    name: string;
    email?: string | undefined;
    phone?: string | undefined;
    passwordHash: string;
    expiresAt: Date;
  }): Promise<Models.public_SignupAttempt> {
    const signupAttempt = await db.orm.public.SignupAttempt.create({
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      passwordHash: data.passwordHash,
      expiresAt: toInstant(data.expiresAt),
    });
    return signupAttempt;
  }

  async findSignupAttemptByIdentifier(
    identifier: string,
  ): Promise<Models.public_SignupAttempt | null> {
    return await db.orm.public.SignupAttempt.where((attempt) =>
      or(attempt.email.eq(identifier), attempt.phone.eq(identifier)),
    ).first();
  }

  async findOtpVerification(
    identifier: string,
    purpose: OtpPurpose,
  ): Promise<Models.public_OtpVerification | null> {
    return await db.orm.public.OtpVerification.where({
      identifier,
      purpose,
      verifiedAt: null,
    }).first();
  }

  async incrementOtpAttempts(otpId: string): Promise<void> {
    const otp = await db.orm.public.OtpVerification.where({
      id: otpId,
    }).first();

    if (!otp) {
      return;
    }

    await db.orm.public.OtpVerification.where({ id: otpId }).updateAll({
      attempts: otp.attempts + 1,
    });
  }

  async markOtpVerified(otpId: string): Promise<void> {
    await db.orm.public.OtpVerification.where({
      id: otpId,
    }).updateAll({
      verifiedAt: new Date(),
    });
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
      verifiedAt: toInstant(new Date()),
    });
  }

  async createOtpVerification(data: {
    identifier: string;
    otpHash: string;
    purpose: OtpPurpose;
    expiresAt: Date;
  }): Promise<void> {
    await db.orm.public.OtpVerification.create({
      identifier: data.identifier,
      otpHash: data.otpHash,
      purpose: data.purpose,
      expiresAt: toInstant(data.expiresAt),
    });
  }
}
