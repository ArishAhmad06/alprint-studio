import type { Models } from "../../prisma/schema.js";
import { db } from "../../prisma/db.js";
import { or } from "@prisma/orm-postgres/orm-client";
import { toInstant } from "../../shared/utils/temporal.js";
import type { IAuthRepository } from "./auth.repository.interface.js";
import type {
  OtpPurpose,
  UserRecord,
  UserSessionRecord,
} from "./auth.types.js";

export class AuthRepository implements IAuthRepository {
  async findUserByIdentifier(identifier: string): Promise<UserRecord | null> {
    return await db.orm.public.User.where((user) =>
      or(user.email.eq(identifier), user.phone.eq(identifier)),
    ).first();
  }

  async findUserById(id: string): Promise<UserRecord | null> {
    return await db.orm.public.User.where({ id }).first();
  }

  async createSignupAttempt(data: {
    name: string;
    email?: string | undefined;
    phone?: string | undefined;
    passwordHash: string;
    expiresAt: Date;
  }): Promise<Models.public_SignupAttempt> {
    return await db.orm.public.SignupAttempt.create({
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      passwordHash: data.passwordHash,
      expiresAt: toInstant(data.expiresAt),
    });
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
      invalidatedAt: null,
    }).first();
  }

  async claimOtpAttempt(
    otpId: string,
    currentAttempts: number,
  ): Promise<boolean> {
    // Only one concurrent request can move attempts from N to N+1.
    const result = await db.orm.public.OtpVerification.where({
      id: otpId,
      attempts: currentAttempts,
      verifiedAt: null,
      invalidatedAt: null,
    }).updateAll({
      attempts: currentAttempts + 1,
    });

    return result.length === 1;
  }

  async consumeOtp(otpId: string): Promise<boolean> {
    const result = await db.orm.public.OtpVerification.where({
      id: otpId,
      verifiedAt: null,
      invalidatedAt: null,
    }).updateAll({
      verifiedAt: toInstant(new Date()),
    });

    return result.length === 1;
  }

  async invalidatePreviousOtp(
    identifier: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    await db.orm.public.OtpVerification.where({
      identifier,
      purpose,
      verifiedAt: null,
      invalidatedAt: null,
    }).updateAll({
      invalidatedAt: toInstant(new Date()),
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

  async createUser(data: {
    name: string;
    email?: string | undefined;
    phone?: string | undefined;
    passwordHash: string;
  }): Promise<UserRecord> {
    return await db.orm.public.User.create({
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      passwordHash: data.passwordHash,
    });
  }

  async deleteSignupAttemptByIdentifier(identifier: string): Promise<void> {
    await db.orm.public.SignupAttempt.where((attempt) =>
      or(attempt.email.eq(identifier), attempt.phone.eq(identifier)),
    ).deleteAll();
  }

  async completeSignupVerification(data: {
    otpId: string;
    identifier: string;
    name: string;
    email?: string | undefined;
    phone?: string | undefined;
    passwordHash: string;
  }): Promise<UserRecord | null> {
    return await db.transaction(async (tx) => {
      const consumed = await tx.orm.public.OtpVerification.where({
        id: data.otpId,
        verifiedAt: null,
        invalidatedAt: null,
      }).updateAll({
        verifiedAt: toInstant(new Date()),
      });

      if (consumed.length !== 1) {
        return null;
      }

      const user = await tx.orm.public.User.create({
        name: data.name,
        email: data.email ?? null,
        phone: data.phone ?? null,
        passwordHash: data.passwordHash,
      });

      await tx.orm.public.SignupAttempt.where((attempt) =>
        or(
          attempt.email.eq(data.identifier),
          attempt.phone.eq(data.identifier),
        ),
      ).deleteAll();

      return user;
    });
  }

  async createSession(data: {
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
  }): Promise<UserSessionRecord> {
    return await db.orm.public.UserSession.create({
      userId: data.userId,
      refreshTokenHash: data.refreshTokenHash,
      expiresAt: toInstant(data.expiresAt),
    });
  }

  async rotateRefreshSession(data: {
    sessionId: string;
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
  }): Promise<UserSessionRecord | null> {
    return await db.transaction(async (tx) => {
      const revokeResult = await tx.orm.public.UserSession.where({
        id: data.sessionId,
        userId: data.userId,
        revokedAt: null,
      }).updateAll({
        revokedAt: toInstant(new Date()),
      });

      if (revokeResult.length !== 1) {
        return null;
      }

      return await tx.orm.public.UserSession.create({
        userId: data.userId,
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: toInstant(data.expiresAt),
      });
    });
  }

  async findSessionByRefreshTokenHash(
    refreshTokenHash: string,
  ): Promise<UserSessionRecord | null> {
    return await db.orm.public.UserSession.where({
      refreshTokenHash,
    }).first();
  }

  async findActiveSessionById(
    sessionId: string,
  ): Promise<UserSessionRecord | null> {
    return await db.orm.public.UserSession.where({
      id: sessionId,
      revokedAt: null,
    }).first();
  }

  async updateSessionLastUsedAt(sessionId: string): Promise<void> {
    await db.orm.public.UserSession.where({
      id: sessionId,
      revokedAt: null,
    }).updateAll({
      lastUsedAt: toInstant(new Date()),
    });
  }

  async revokeSession(sessionId: string): Promise<void> {
    await db.orm.public.UserSession.where({
      id: sessionId,
      revokedAt: null,
    }).updateAll({
      revokedAt: toInstant(new Date()),
    });
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await db.orm.public.UserSession.where({
      userId,
      revokedAt: null,
    }).updateAll({
      revokedAt: toInstant(new Date()),
    });
  }
}
