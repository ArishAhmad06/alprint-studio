import type { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";
import { AppError } from "../errors/app-error.js";

const accessTokenSecret = process.env["JWT_ACCESS_TOKEN_SECRET"];

if (!accessTokenSecret) {
  throw new Error("JWT_ACCESS_TOKEN_SECRET is not configured");
}

const secret = new TextEncoder().encode(accessTokenSecret);

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError(
        401,
        "UNAUTHORIZED",
        "Authentication required",
      );
    }

    const token = authorization.slice(7);

    const { payload } = await jwtVerify(token, secret);

    if (
      typeof payload.sub !== "string" ||
      typeof payload.sid !== "string"
    ) {
      throw new AppError(
        401,
        "INVALID_ACCESS_TOKEN",
        "Invalid access token",
      );
    }

    req.auth = {
      userId: payload.sub,
      sessionId: payload.sid,
    };

    next();
  } catch (error) {
    next(error);
  }
};