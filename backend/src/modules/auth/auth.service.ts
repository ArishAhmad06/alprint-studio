import type { IAuthRepository } from "./auth.repository.interface.js";
import type { OtpPurpose } from "./auth.types.js";
import { signupSchema } from "./auth.schema.js";
import { hashPassword } from "../../shared/utils/password.js";
import { generateOtp, hashOtp } from "../../shared/utils/otp.js";
import type { IOtpProvider } from "../../infrastructure/otp/otp.provider.js";

export class AuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly otpProvider: IOtpProvider,
  ) {}

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

  async signup(input: unknown) {
    const data = signupSchema.parse(input);

    const identifier = data.email ?? data.phone!;
    const existingUser =
      await this.authRepository.findUserByIdentifier(identifier);

    if (existingUser) {
      throw new Error("User already exists");
    }
    const passwordHash = await hashPassword(data.password);

    const signupAttempt = await this.authRepository.createSignupAttempt({
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const otp = generateOtp();
    const otpHash = hashOtp(otp); // use otphash in db

    await this.otpProvider.sendOtp(identifier, otp);

    //otp invalidation
    await this.authRepository.invalidatePreviousOtp(identifier, "SIGNUP");

    //store on the db service
    await this.authRepository.createOtpVerification({
      identifier,
      otpHash,
      purpose: "SIGNUP",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return {
      message: "Otp sent successfully",
    };
  }
}
