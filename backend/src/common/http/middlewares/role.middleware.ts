import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js";

type Role = "CUSTOMER" | "OWNER";

// Must run after `authenticate`.
export const requireRole = (...allowed: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth || !allowed.includes(req.auth.role)) {
      next(
        new AppError(
          403,
          "FORBIDDEN",
          "You do not have permission to perform this action",
        ),
      );
      return;
    }

    next();
  };
};