import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { pinoHttp } from "pino-http";

import { env } from "./config/env.js";
import { requestIdMiddleware } from "./common/http/request-id.js";
import logger from "./infrastructure/logger/index.js";
import { notFoundHandler } from "./common/http/not-found.js";
import { errorHandler } from "./common/http/error-handler.js";
import authRouter from "./modules/auth/auth.router.js";

const app = express();

app.disable("x-powered-by");

// Only trust the proxy header when actually behind one (adjust the hop count to your host).
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());

if (env.FRONTEND_URL) {
  app.use(cors({ origin: env.FRONTEND_URL }));
}

app.use(express.json({ limit: "10kb" }));
app.use(requestIdMiddleware);

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.requestId,
  }),
);

const limiter = (limit: number) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      data: null,
      error: {
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests, please try again later",
      },
    },
  });

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ data: { status: "ok" }, error: null });
});

// Stricter limits where OTPs are sent or passwords are tried.
app.use("/api/v1/auth/signup", limiter(10));
app.use("/api/v1/auth/login", limiter(10));
app.use("/api/v1/auth", limiter(100));
app.use("/api/v1/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;