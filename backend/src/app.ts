import express from "express";
import { requestIdMiddleware } from "./common/http/request-id.js";
import { pinoHttp } from "pino-http";
import logger from "./infrastructure/logger/index.js";
import { randomUUID } from "node:crypto";

const app = express();

app.use(requestIdMiddleware);

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.requestId,
  }),
);

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    data: {
      status: "ok",
    },
    error: null,
  });
});

export default app;
