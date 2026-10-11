import { Router } from "express";
import { sql } from "../db/index.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await sql`
      SELECT NOW() AS current_time
    `;

    res.json({
      status: "ok",
      service: "VaaniX API",
      database: "connected",
      databaseTime: result[0].current_time,
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      status: "error",
      service: "VaaniX API",
      database: "disconnected",
    });
  }
});

export default router;