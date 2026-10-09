import type { Request, Response, NextFunction } from "express";

import { AppError } from "../errors/app-error.js";
import logger from "../../../../dist/infrastructure/logger/index.js";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (res.headersSent) {
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  logger.error(
    {
      err: error,
      method: req.method,
      path: req.originalUrl,
    },
    "Unhandled request error",
  );

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
  });
};
