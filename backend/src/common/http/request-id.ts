import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = req.header("X-Request-ID") ?? randomUUID();

  req.requestId = requestId;

  res.setHeader("X-Request-ID", requestId);
  next();
};
