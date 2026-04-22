const express = require('express');
const cors = require('cors');
const path = require('path'); // Path handle karne ke liye
require('dotenv').config();

const summarizeRoutes = require('./routes/summarize');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes setup
app.use('/api', summarizeRoutes);

// --- STATIC FILE SERVING (Deployment fix) ---
// Express ko bataya ki 'client' folder mein frontend files hain
app.use(express.static(path.join(__dirname, '../client')));

// Har request ko 'index.html' par bhej do (Taaki refresh karne pe error na aaye)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT} - server.js:28`);
});