const express = require('express');
const router = express.Router();
const { processNotes } = require('../controllers/summarizeController');

// Jab bhi koi POST request /summarize par aayegi, controller ko bhej do
router.post('/summarize', processNotes);

module.exports = router;