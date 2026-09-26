import express from "express";

const app = express();

app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    data: {
      status: "ok",
    },
    error: null,
  });
});

export default app;
