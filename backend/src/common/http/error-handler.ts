import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errors/app-error.js";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      data: null,
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }
};
