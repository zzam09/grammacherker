-- ============================================================
--  GrammarCheck — Database Migrations
--  Run once against your PostgreSQL database
-- ============================================================

-- Enable pgcrypto for gen_random_uuid() if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop table if re-running (optional, safe for dev)
-- DROP TABLE IF EXISTS checks;

CREATE TABLE IF NOT EXISTS checks (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  original_text  TEXT          NOT NULL,
  corrected_text TEXT,
  issues         JSONB         NOT NULL DEFAULT '[]'::jsonb,
  score          INTEGER       CHECK (score >= 0 AND score <= 100),
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Index for fast history queries (most recent first)
CREATE INDEX IF NOT EXISTS idx_checks_created_at ON checks (created_at DESC);

-- Comment the table for documentation
COMMENT ON TABLE checks IS 'Stores every grammar check request and its results';
COMMENT ON COLUMN checks.issues IS 'JSONB array of issue objects: {type, message, offset, length, suggestion}';
COMMENT ON COLUMN checks.score  IS 'Grammar quality score 0–100';
