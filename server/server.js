const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const summarizeRoutes = require('./routes/summarize');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', summarizeRoutes);

// --- STATIC FILE SERVING ---
app.use(express.static(path.join(__dirname, '../client')));

// --- FIXED ROUTING (Bina app.get aur bina wildcard ke) ---
// Middleware check karega ki request API nahi hai, toh index.html bhejega
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../client/index.html'));
    } else {
        next();
    }
});

// --- PORT BINDING ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT} - server.js:32`);
});