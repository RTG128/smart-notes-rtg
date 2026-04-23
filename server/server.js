const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const summarizeRoutes = require('./routes/summarize');

const app = express();
const PORT = process.env.PORT || 10000; // Render aksar 10000 port assign karta hai

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', summarizeRoutes);

// --- STATIC FILE SERVING ---
// Absolute path ka use karna hamesha safest hota hai
const clientPath = path.resolve(__dirname, '../client');
app.use(express.static(clientPath));

// --- FIXED ROUTING ---
// Middleware: API calls ko chhod kar baaki sab index.html par bhej do
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientPath, 'index.html'));
    } else {
        next();
    }
});

// --- PORT BINDING ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT} - server.js:34`);
});