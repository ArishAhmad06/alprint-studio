import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errors/app-error.js";
import logger from "../../infrastructure/logger/index.js";

export const errorHandler = (
  error: unknown,
  req: Request,
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

  logger.error(
    {
      err: error,
      requestId: req.requestId,
    },
    "Unhandled application error",
  );

  res.status(500).json({
    data: null,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    },
  });
};