import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import memoryRoutes from "./routes/memory.routes.js";
import benchmarkRoutes from "./routes/benchmark.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "VaaniX API",
    version: "1.0.0",
    status: "running",
  });
});

app.use("/api/health", healthRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/memory", memoryRoutes);

app.use("/api/benchmark", benchmarkRoutes);

export default app;