import express from "express";
import PinoHttp, { pinoHttp } from "pino-http";
import logger from "./infrastructure/logger/index.js";

const app = express();

app.use(
  pinoHttp({
    logger,
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
