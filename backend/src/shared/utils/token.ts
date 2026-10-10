import crypto from "node:crypto";
import { SignJWT } from "jose";
import { env } from "../../config/env.js";

const secret = new TextEncoder().encode(env.JWT_ACCESS_TOKEN_SECRET);

export async function generateAccessToken(data: {
  userId: string;
  sessionId: string;
}): Promise<string> {
  return await new SignJWT({ sid: data.sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(data.userId)
    .setIssuedAt()
    .setExpirationTime(env.JWT_ACCESS_TOKEN_EXPIRY)
    .sign(secret);
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}