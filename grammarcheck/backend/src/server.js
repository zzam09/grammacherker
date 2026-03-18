// ============================================================
//  server.js — Express entry point
// ============================================================
'use strict';

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');

const checkRoute   = require('./routesApi/check');
const historyRoute = require('./routesApi/history');
const db           = require('./db');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Global Middleware ─────────────────────────────────────────
app.use(helmet({
  // Allow the frontend (same origin or localhost) to embed the app
  contentSecurityPolicy: false,
}));

// CORS — allow all origins in development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Health-check ──────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api/check',   checkRoute);
app.use('/api/history', historyRoute);

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ── Start server ──────────────────────────────────────────────
async function start() {
  // Quick DB connectivity check before accepting traffic
  try {
    await db.query('SELECT 1');
    console.log('[DB] PostgreSQL connection verified ✓');
  } catch (err) {
    console.error('[DB] Cannot connect to PostgreSQL:', err.message);
    console.error('     Please check DATABASE_URL in your .env file.');
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 GrammarCheck API running on http://localhost:${PORT}`);
    console.log(`   Health:  http://localhost:${PORT}/health`);
    console.log(`   Check:   POST http://localhost:${PORT}/api/check`);
    console.log(`   History: GET  http://localhost:${PORT}/api/history\n`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n[server] ${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await db.end();
      console.log('[server] Database pool closed. Goodbye.');
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

start();
