// ============================================================
//  routes/history.js — GET /api/history  |  DELETE /api/history/:id
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const { getHistory, deleteRecord } = require('../controllers/historyController');

// GET  /api/history?limit=10&offset=0
router.get('/', getHistory);

// DELETE /api/history/:id
router.delete('/:id', deleteRecord);

module.exports = router;
