import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

import { AppError } from "../errors/app-error.js";

export const validateBody = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(
        new AppError(
          400,
          "VALIDATION_ERROR",
          result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; "),
        ),
      );
      return;
    }

    req.body = result.data;
    next();
  };
};
