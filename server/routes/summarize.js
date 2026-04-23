const express = require('express');
const router = express.Router();
const { processNotes } = require('../controllers/summarizeController');

// Jab bhi POST request /api/summarize par aayegi, controller chalega
router.post('/summarize', processNotes);

module.exports = router;