import type { Request, Response, NextFunction } from "express";
import { jwtVerify, errors } from "jose";
import { AppError } from "../errors/app-error.js";
import { env } from "../../../config/env.js";

const secret = new TextEncoder().encode(env.JWT_ACCESS_TOKEN_SECRET);

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    }

    const token = authorization.slice(7);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    }).catch((error: unknown) => {
      if (error instanceof errors.JWTExpired) {
        throw new AppError(401, "ACCESS_TOKEN_EXPIRED", "Access token expired");
      }
      throw new AppError(401, "INVALID_ACCESS_TOKEN", "Invalid access token");
    });

    if (typeof payload.sub !== "string" || typeof payload.sid !== "string") {
      throw new AppError(401, "INVALID_ACCESS_TOKEN", "Invalid access token");
    }

    req.auth = { userId: payload.sub, sessionId: payload.sid };

    next();
  } catch (error) {
    next(error);
  }
};