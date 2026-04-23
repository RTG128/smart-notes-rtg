const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const summarizeRoutes = require('./routes/summarize');

const app = express();
// Render ka diya hua PORT use karna zaroori hai
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', summarizeRoutes);

// --- STATIC FILE SERVING ---
// Path ko root directory se fix kiya gaya hai
app.use(express.static(path.join(__dirname, '../client')));

// '*' ki jagah '/*' use karo, yeh naye Express version mein sahi chalta hai
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// --- PORT BINDING FIX ---
// '0.0.0.0' add karne se Render ka "no open ports" wala error chala jayega
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT} - server.js:30`);
});