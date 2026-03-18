// ============================================================
//  controllers/checkController.js
//  POST /api/check
//  1. Validate input
//  2. Call grammarService
//  3. Persist result to DB
//  4. Return JSON
// ============================================================

'use strict';

const { checkGrammar } = require('../servicesLogic/grammarService');
const db = require('../db');

async function checkText(req, res) {
  const { text } = req.body;

  // ── 1. Input validation ──────────────────────────────────────
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Request body must contain a non-empty "text" field.',
    });
  }

  try {
    // ── 2. Grammar analysis ──────────────────────────────────────
    const result = await checkGrammar(text);

    // ── 3. Persist to database ────────────────────────────────────
    const { rows } = await db.query(
      `INSERT INTO checks (original_text, corrected_text, issues, score)
       VALUES ($1, $2, $3, $4)
       RETURNING id, original_text, corrected_text, issues, score, created_at`,
      [
        text.trim(),
        result.corrected_text,
        JSON.stringify(result.issues),
        result.score,
      ]
    );

    const record = rows[0];

    // ── 4. Return JSON ─────────────────────────────────────────────
    return res.status(200).json({
      id:             record.id,
      score:          record.score,
      corrected_text: record.corrected_text,
      issues:         record.issues,           // pg returns JSONB as parsed JS already
      created_at:     record.created_at,
    });

  } catch (err) {
    // User-facing validation errors from the service layer
    if (err.message && (err.message.includes('limit') || err.message.includes('blank'))) {
      return res.status(400).json({ error: 'Validation error', message: err.message });
    }

    console.error('[checkController] Unexpected error:', err);
    return res.status(500).json({
      error:   'Internal server error',
      message: 'Something went wrong while analysing your text. Please try again.',
    });
  }
}

module.exports = { checkText };
