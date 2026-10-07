import crypto from "node:crypto";
import { SignJWT } from "jose";

const accessTokenSecret = process.env["JWT_ACCESS_TOKEN_SECRET"];

if (!accessTokenSecret) {
  throw new Error("JWT_ACCESS_TOKEN_SECRET is not configured");
}

const secret = new TextEncoder().encode(accessTokenSecret);

export async function generateAccessToken(data: {
  userId: string;
  sessionId: string;
}): Promise<string> {
  return await new SignJWT({
    sid: data.sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(data.userId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}