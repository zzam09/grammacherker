// ============================================================
//  routes/check.js — POST /api/check
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const { checkText } = require('../controllers/checkController');

// POST /api/check
router.post('/', checkText);

module.exports = router;
