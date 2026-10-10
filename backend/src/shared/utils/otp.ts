import crypto from "node:crypto";
import { env } from "../../config/env.js";

export function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export function hashOtp(otp: string): string {
  return crypto.createHmac("sha256", env.OTP_SECRET).update(otp).digest("hex");
}