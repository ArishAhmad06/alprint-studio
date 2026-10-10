import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

import { AppError } from "../errors/app-error.js";

const formatIssues = (
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
): string =>
  issues
    .map((issue) => `${issue.path.map(String).join(".")}: ${issue.message}`)
    .join("; ");

export const validateBody = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(
        new AppError(400, "VALIDATION_ERROR", formatIssues(result.error.issues)),
      );
      return;
    }

    req.body = result.data;
    next();
  };
};


// Params are already strings, so this only validates; it does not replace them.
export const validateParams = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      next(
        new AppError(400, "VALIDATION_ERROR", formatIssues(result.error.issues)),
      );
      return;
    }

    next();
  };
};