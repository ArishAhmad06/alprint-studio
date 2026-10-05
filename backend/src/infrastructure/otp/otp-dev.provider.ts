import type { IOtpProvider } from "./otp.provider.js";
export class DevOtpProvider implements IOtpProvider {
  async sendOtp(identifier: string, otp: string): Promise<void> {
    console.log(`[DEV OTP] ${identifier}: ${otp}`);
  }
}
