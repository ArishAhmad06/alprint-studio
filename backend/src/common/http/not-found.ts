import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errors/app-error.js";

export const notFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(new AppError(404, "ROUTE_NOT_FOUND", "Route not found"));
};
