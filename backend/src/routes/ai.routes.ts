import { Router } from "express";
import { gemini } from "../services/gemini.service.js";

const router = Router();

/*
 * Simple Gemini text test
 */
router.get("/test", async (_req, res) => {
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3.8-flash",
      contents: "Reply with exactly: VaaniX Gemini connection successful.",
    });

    res.json({
      status: "ok",
      message: response.text,
    });
  } catch (error) {
    console.error("Gemini connection failed:", error);

    res.status(500).json({
      status: "error",
      message: "Gemini connection failed",
    });
  }
});

/*
 * Create a short-lived token for the browser
 * to connect directly to Gemini Live API.
 */
router.get("/live-token", async (_req, res) => {
  try {
    const expireTime = new Date(
      Date.now() + 30 * 60 * 1000
    ).toISOString();

    const token = await gemini.authTokens.create({
      config: {
        uses: 1,
        expireTime,
      },
    });

    res.json({
      status: "ok",
      token: token.name,
    });
  } catch (error) {
    console.error("Live token creation failed:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to create Gemini Live token",
    });
  }
});

export default router;