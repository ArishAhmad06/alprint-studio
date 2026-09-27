import app from "./app.js";
import { env } from "./config/env.js";
import logger from "./infrastructure/logger/index.js";

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
});

const shutdown = () => {
  logger.info("Shutdown initiated");

  server.close(() => {
    logger.info("Server closed");
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
export default server;
