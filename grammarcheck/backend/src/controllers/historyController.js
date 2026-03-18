// ============================================================
//  controllers/historyController.js
//  GET    /api/history?limit=10&offset=0  → paginated list
//  DELETE /api/history/:id                → remove single record
// ============================================================

'use strict';

const db = require('../db');

// ── GET /api/history ─────────────────────────────────────────
async function getHistory(req, res) {
  // Parse + clamp pagination params
  let limit  = parseInt(req.query.limit,  10);
  let offset = parseInt(req.query.offset, 10);

  if (isNaN(limit)  || limit  < 1)   limit  = 10;
  if (isNaN(offset) || offset < 0)   offset = 0;
  if (limit > 100)                   limit  = 100;   // hard cap

  try {
    // Run count and data queries in parallel
    const [countResult, dataResult] = await Promise.all([
      db.query('SELECT COUNT(*)::int AS total FROM checks'),
      db.query(
        `SELECT id, original_text, corrected_text, issues, score, created_at
         FROM checks
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
    ]);

    return res.status(200).json({
      data:  dataResult.rows,
      total: countResult.rows[0].total,
      limit,
      offset,
    });

  } catch (err) {
    console.error('[historyController] getHistory error:', err);
    return res.status(500).json({
      error:   'Internal server error',
      message: 'Could not retrieve history.',
    });
  }
}

// ── DELETE /api/history/:id ──────────────────────────────────
async function deleteRecord(req, res) {
  const { id } = req.params;

  // Basic UUID format check (prevents SQL injection footprint & gives better errors)
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const { rowCount } = await db.query('DELETE FROM checks WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('[historyController] deleteRecord error:', err);
    return res.status(500).json({
      error:   'Internal server error',
      message: 'Could not delete the record.',
    });
  }
}

module.exports = { getHistory, deleteRecord };
