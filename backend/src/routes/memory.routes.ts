import { Router } from "express";
import { sql } from "../db/index.js";

const router = Router();

/*
 * SAVE A MESSAGE
 *
 * POST /api/memory/messages
 */
router.post("/messages", async (req, res) => {
  try {
    const { sessionId, role, content } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        status: "error",
        message: "sessionId is required",
      });
    }

    if (role !== "user" && role !== "assistant") {
      return res.status(400).json({
        status: "error",
        message: "role must be either user or assistant",
      });
    }

    if (
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        status: "error",
        message: "content is required",
      });
    }

    const result = await sql`
      INSERT INTO messages (
        session_id,
        role,
        content
      )
      VALUES (
        ${sessionId},
        ${role},
        ${content.trim()}
      )
      RETURNING
        id,
        session_id,
        role,
        content,
        created_at
    `;

    res.status(201).json({
      status: "ok",
      message: result[0],
    });
  } catch (error) {
    console.error(
      "Failed to save message:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to save message",
    });
  }
});

/*
 * LOAD CONVERSATION
 *
 * GET /api/memory/messages/:sessionId
 */
router.get(
  "/messages/:sessionId",
  async (req, res) => {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({
          status: "error",
          message: "sessionId is required",
        });
      }

      const messages = await sql`
        SELECT
          id,
          session_id,
          role,
          content,
          created_at
        FROM messages
        WHERE session_id = ${sessionId}
        ORDER BY created_at ASC, id ASC
      `;

      res.json({
        status: "ok",
        messages,
      });
    } catch (error) {
      console.error(
        "Failed to load messages:",
        error
      );

      res.status(500).json({
        status: "error",
        message: "Failed to load messages",
      });
    }
  }
);

export default router;