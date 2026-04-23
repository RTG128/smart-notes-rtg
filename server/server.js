const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const summarizeRoutes = require('./routes/summarize');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', summarizeRoutes);

// --- STATIC FILE SERVING ---
// Ye __dirname se 1 level upar 'client' folder dhoondega
const clientPath = path.resolve(__dirname, '../client');
app.use(express.static(clientPath));

// --- FIXED ROUTING ---
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientPath, 'index.html'));
    } else {
        next();
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is live on port ${PORT}`);
});