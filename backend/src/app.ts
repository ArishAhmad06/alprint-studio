import express from "express";
import { requestIdMiddleware } from "./common/http/request-id.js";
import { pinoHttp } from "pino-http";
import logger from "./infrastructure/logger/index.js";
import { notFoundHandler } from "./common/http/not-found.js";
import { errorHandler } from "./common/http/error-handler.js";

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

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
