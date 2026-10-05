import type { IAuthRepository } from "./auth.repository.interface";
import type { AppError } from "../../common/http/errors/app-error";
import type { OtpPurpose } from "./auth.types";

export class AuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async findUserByIdentifier(identifier: string) {
    return this.authRepository.findUserByIdentifier(identifier);
  }

  async createSignupAttempt(data: {
    name: string;
    email?: string;
    phone?: string;
    passwordHash: string;
    expiresAt: Date;
  }) {
    return this.authRepository.createSignupAttempt(data);
  }

  async invalidatePreviousOtp(data: {
    identifier: string;
    purpose: OtpPurpose;
  }): Promise<void> {
    await this.authRepository.invalidatePreviousOtp(
      data.identifier,
      data.purpose,
    );
  }

  async createOtpVerification(data: {
    identifier: string;
    otpHash: string;
    purpose: OtpPurpose;
    expiresAt: Date;
  }): Promise<void> {
    await this.authRepository.createOtpVerification(data);
  }
}
