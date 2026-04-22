const express = require('express');
const cors = require('cors');
require('dotenv').config(); // .env file se secret keys load karne ke liye

const summarizeRoutes = require('./routes/summarize');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (Taki frontend aur backend aapas mein baat kar sakein)
app.use(cors());
app.use(express.json());

// Routes setup
app.use('/api', summarizeRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT} - server.js:18`);
});