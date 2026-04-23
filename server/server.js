const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const summarizeRoutes = require('./routes/summarize');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', summarizeRoutes);

// --- FIXING THE PATH ---
// Hum root folder se 'client' folder ko point kar rahe hain
app.use(express.static(path.join(__dirname, '../client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT} - server.js:25`);
});