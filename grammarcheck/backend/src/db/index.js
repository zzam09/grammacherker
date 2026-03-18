// ============================================================
//  db/index.js — PostgreSQL connection pool
//  Uses the `pg` package and DATABASE_URL from .env
// ============================================================

'use strict';

const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Reasonable defaults for a small app
  max: 10,               // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }   // e.g. Heroku / Railway
    : false,
});

// Log when the pool establishes a new connection (dev only)
if (process.env.NODE_ENV !== 'production') {
  pool.on('connect', () => {
    console.log('[DB] New client connected to PostgreSQL pool');
  });
}

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle PostgreSQL client:', err.message);
});

/**
 * Convenience wrapper — automatically acquires + releases a client.
 * Usage:  const rows = await db.query('SELECT ...', [params]);
 */
const db = {
  query: (text, params) => pool.query(text, params),

  /** Grab a raw client (for transactions) — caller must call client.release() */
  getClient: () => pool.connect(),

  /** Graceful shutdown — call on SIGTERM */
  end: () => pool.end(),
};

module.exports = db;
