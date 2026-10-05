export interface IOtpProvider {
  sendOtp(identifier: string, otp: string): Promise<void>;
}
