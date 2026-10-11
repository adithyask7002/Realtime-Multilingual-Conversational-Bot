import { Router } from "express";
import { sql } from "../db/index.js";
import {
  calculateBenchmarkMetrics,
} from "../services/benchmark.service.js";

const router = Router();

/**
 * POST /api/benchmark/evaluate
 *
 * Calculates WER + CER and saves the benchmark result.
 */
router.post("/evaluate", async (req, res) => {
  try {
    const {
      testId,
      language,
      referenceText,
      hypothesisText,
      languageDetected,
      languageCorrect,
      codeSwitch,
      latencyMs,
      ttsRating,
      system,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!testId || typeof testId !== "string") {
      return res.status(400).json({
        status: "error",
        message: "testId is required",
      });
    }

    if (!language || typeof language !== "string") {
      return res.status(400).json({
        status: "error",
        message: "language is required",
      });
    }

    if (
      typeof referenceText !== "string" ||
      !referenceText.trim()
    ) {
      return res.status(400).json({
        status: "error",
        message: "referenceText is required",
      });
    }

    if (
      typeof hypothesisText !== "string" ||
      !hypothesisText.trim()
    ) {
      return res.status(400).json({
        status: "error",
        message: "hypothesisText is required",
      });
    }

    // -----------------------------
    // Calculate WER + CER
    // -----------------------------

    const metrics = calculateBenchmarkMetrics(
      referenceText,
      hypothesisText
    );

    // -----------------------------
    // Save result to Neon
    // -----------------------------

    const result = await sql`
      INSERT INTO benchmark_results (
        test_id,
        language,
        reference_text,
        hypothesis_text,
        wer,
        cer,
        language_detected,
        language_correct,
        code_switch,
        latency_ms,
        tts_rating,
        system
      )
      VALUES (
        ${testId},
        ${language},
        ${referenceText.trim()},
        ${hypothesisText.trim()},
        ${metrics.wer},
        ${metrics.cer},
        ${languageDetected ?? null},
        ${languageCorrect ?? null},
        ${codeSwitch ?? null},
        ${latencyMs ?? null},
        ${ttsRating ?? null},
        ${system ?? "vaanix"}
      )
      RETURNING
        id,
        test_id,
        language,
        reference_text,
        hypothesis_text,
        wer,
        cer,
        language_detected,
        language_correct,
        code_switch,
        latency_ms,
        tts_rating,
        system,
        created_at
    `;

    // -----------------------------
    // Return result
    // -----------------------------

    res.status(201).json({
      status: "ok",

      metrics: {
        wer: metrics.wer,
        werPercent: `${(metrics.wer * 100).toFixed(2)}%`,

        cer: metrics.cer,
        cerPercent: `${(metrics.cer * 100).toFixed(2)}%`,
      },

      benchmark: result[0],
    });
  } catch (error) {
    console.error(
      "Benchmark evaluation failed:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Benchmark evaluation failed",
    });
  }
});

// ============================================
// GET ALL BENCHMARK RESULTS
// ============================================

router.get("/results", async (_req, res) => {
  try {
    const results = await sql`
      SELECT
        id,
        test_id,
        language,
        reference_text,
        hypothesis_text,
        wer,
        cer,
        language_detected,
        language_correct,
        code_switch,
        latency_ms,
        tts_rating,
        system,
        created_at
      FROM benchmark_results
      ORDER BY created_at DESC, id DESC
    `;

    res.json({
      status: "ok",
      count: results.length,
      results,
    });
  } catch (error) {
    console.error(
      "Failed to load benchmark results:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to load benchmark results",
    });
  }
});


// ============================================
// GET BENCHMARK SUMMARY
// ============================================

router.get("/summary", async (_req, res) => {
  try {
    const summary = await sql`
      SELECT
        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS average_wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS average_cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(
            CASE
              WHEN code_switch = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS code_switch_rate_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
    `;

    const languageResults = await sql`
      SELECT
        language,

        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
      GROUP BY language
      ORDER BY language
    `;

    res.json({
      status: "ok",
      overall: summary[0],
      languages: languageResults,
    });
  } catch (error) {
    console.error(
      "Failed to calculate benchmark summary:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to calculate benchmark summary",
    });
  }
});


// ============================================
// GET ALL BENCHMARK RESULTS
// ============================================

router.get("/results", async (_req, res) => {
  try {
    const results = await sql`
      SELECT
        id,
        test_id,
        language,
        reference_text,
        hypothesis_text,
        wer,
        cer,
        language_detected,
        language_correct,
        code_switch,
        latency_ms,
        tts_rating,
        system,
        created_at
      FROM benchmark_results
      ORDER BY created_at DESC, id DESC
    `;

    res.json({
      status: "ok",
      count: results.length,
      results,
    });
  } catch (error) {
    console.error(
      "Failed to load benchmark results:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to load benchmark results",
    });
  }
});


// ============================================
// GET BENCHMARK SUMMARY
// ============================================

router.get("/summary", async (_req, res) => {
  try {
    const summary = await sql`
      SELECT
        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS average_wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS average_cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(
            CASE
              WHEN code_switch = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS code_switch_rate_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
    `;

    const languageResults = await sql`
      SELECT
        language,

        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
      GROUP BY language
      ORDER BY language
    `;

    res.json({
      status: "ok",
      overall: summary[0],
      languages: languageResults,
    });
  } catch (error) {
    console.error(
      "Failed to calculate benchmark summary:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to calculate benchmark summary",
    });
  }
});

// ============================================
// GET ALL BENCHMARK RESULTS
// ============================================

router.get("/results", async (_req, res) => {
  try {
    const results = await sql`
      SELECT
        id,
        test_id,
        language,
        reference_text,
        hypothesis_text,
        wer,
        cer,
        language_detected,
        language_correct,
        code_switch,
        latency_ms,
        tts_rating,
        system,
        created_at
      FROM benchmark_results
      ORDER BY created_at DESC, id DESC
    `;

    res.json({
      status: "ok",
      count: results.length,
      results,
    });
  } catch (error) {
    console.error(
      "Failed to load benchmark results:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to load benchmark results",
    });
  }
});


// ============================================
// GET BENCHMARK SUMMARY
// ============================================

router.get("/summary", async (_req, res) => {
  try {
    const summary = await sql`
      SELECT
        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS average_wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS average_cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(
            CASE
              WHEN code_switch = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS code_switch_rate_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
    `;

    const languageResults = await sql`
      SELECT
        language,

        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
      GROUP BY language
      ORDER BY language
    `;

    res.json({
      status: "ok",
      overall: summary[0],
      languages: languageResults,
    });
  } catch (error) {
    console.error(
      "Failed to calculate benchmark summary:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to calculate benchmark summary",
    });
  }
});

// ============================================
// GET ALL BENCHMARK RESULTS
// ============================================

router.get("/results", async (_req, res) => {
  try {
    const results = await sql`
      SELECT
        id,
        test_id,
        language,
        reference_text,
        hypothesis_text,
        wer,
        cer,
        language_detected,
        language_correct,
        code_switch,
        latency_ms,
        tts_rating,
        system,
        created_at
      FROM benchmark_results
      ORDER BY created_at DESC, id DESC
    `;

    res.json({
      status: "ok",
      count: results.length,
      results,
    });
  } catch (error) {
    console.error(
      "Failed to load benchmark results:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to load benchmark results",
    });
  }
});


// ============================================
// GET BENCHMARK SUMMARY
// ============================================

router.get("/summary", async (_req, res) => {
  try {
    const summary = await sql`
      SELECT
        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS average_wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS average_cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(
            CASE
              WHEN code_switch = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS code_switch_rate_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
    `;

    const languageResults = await sql`
      SELECT
        language,

        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
      GROUP BY language
      ORDER BY language
    `;

    res.json({
      status: "ok",
      overall: summary[0],
      languages: languageResults,
    });
  } catch (error) {
    console.error(
      "Failed to calculate benchmark summary:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to calculate benchmark summary",
    });
  }
});
// ============================================
// GET ALL BENCHMARK RESULTS
// ============================================

router.get("/results", async (_req, res) => {
  try {
    const results = await sql`
      SELECT
        id,
        test_id,
        language,
        reference_text,
        hypothesis_text,
        wer,
        cer,
        language_detected,
        language_correct,
        code_switch,
        latency_ms,
        tts_rating,
        system,
        created_at
      FROM benchmark_results
      ORDER BY created_at DESC, id DESC
    `;

    res.json({
      status: "ok",
      count: results.length,
      results,
    });
  } catch (error) {
    console.error(
      "Failed to load benchmark results:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to load benchmark results",
    });
  }
});


// ============================================
// GET BENCHMARK SUMMARY
// ============================================

router.get("/summary", async (_req, res) => {
  try {
    const summary = await sql`
      SELECT
        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS average_wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS average_cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(
            CASE
              WHEN code_switch = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS code_switch_rate_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
    `;

    const languageResults = await sql`
      SELECT
        language,

        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
      GROUP BY language
      ORDER BY language
    `;

    res.json({
      status: "ok",
      overall: summary[0],
      languages: languageResults,
    });
  } catch (error) {
    console.error(
      "Failed to calculate benchmark summary:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to calculate benchmark summary",
    });
  }
});

// ============================================
// GET ALL BENCHMARK RESULTS
// ============================================

router.get("/results", async (_req, res) => {
  try {
    const results = await sql`
      SELECT
        id,
        test_id,
        language,
        reference_text,
        hypothesis_text,
        wer,
        cer,
        language_detected,
        language_correct,
        code_switch,
        latency_ms,
        tts_rating,
        system,
        created_at
      FROM benchmark_results
      ORDER BY created_at DESC, id DESC
    `;

    res.json({
      status: "ok",
      count: results.length,
      results,
    });
  } catch (error) {
    console.error(
      "Failed to load benchmark results:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to load benchmark results",
    });
  }
});


// ============================================
// GET BENCHMARK SUMMARY
// ============================================

router.get("/summary", async (_req, res) => {
  try {
    const summary = await sql`
      SELECT
        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS average_wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS average_cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(
            CASE
              WHEN code_switch = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS code_switch_rate_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
    `;

    const languageResults = await sql`
      SELECT
        language,

        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
      GROUP BY language
      ORDER BY language
    `;

    res.json({
      status: "ok",
      overall: summary[0],
      languages: languageResults,
    });
  } catch (error) {
    console.error(
      "Failed to calculate benchmark summary:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to calculate benchmark summary",
    });
  }
});


// ============================================
// GET ALL BENCHMARK RESULTS
// ============================================

router.get("/results", async (_req, res) => {
  try {
    const results = await sql`
      SELECT
        id,
        test_id,
        language,
        reference_text,
        hypothesis_text,
        wer,
        cer,
        language_detected,
        language_correct,
        code_switch,
        latency_ms,
        tts_rating,
        system,
        created_at
      FROM benchmark_results
      ORDER BY created_at DESC, id DESC
    `;

    res.json({
      status: "ok",
      count: results.length,
      results,
    });
  } catch (error) {
    console.error(
      "Failed to load benchmark results:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to load benchmark results",
    });
  }
});


// ============================================
// GET BENCHMARK SUMMARY
// ============================================

router.get("/summary", async (_req, res) => {
  try {
    const summary = await sql`
      SELECT
        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS average_wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS average_cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(
            CASE
              WHEN code_switch = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS code_switch_rate_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
    `;

    const languageResults = await sql`
      SELECT
        language,

        COUNT(*)::int AS total_tests,

        ROUND(
          AVG(wer)::numeric * 100,
          2
        ) AS wer_percent,

        ROUND(
          AVG(cer)::numeric * 100,
          2
        ) AS cer_percent,

        ROUND(
          AVG(latency_ms)::numeric,
          0
        ) AS average_latency_ms,

        ROUND(
          AVG(
            CASE
              WHEN language_correct = TRUE
              THEN 1
              ELSE 0
            END
          )::numeric * 100,
          2
        ) AS language_id_accuracy_percent,

        ROUND(
          AVG(tts_rating)::numeric,
          2
        ) AS average_tts_rating

      FROM benchmark_results
      WHERE system = 'vaanix'
      GROUP BY language
      ORDER BY language
    `;

    res.json({
      status: "ok",
      overall: summary[0],
      languages: languageResults,
    });
  } catch (error) {
    console.error(
      "Failed to calculate benchmark summary:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to calculate benchmark summary",
    });
  }
});

export default router;