const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const summarizeRoutes = require("./routes/summarize");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.use("/api", summarizeRoutes);

const clientPath = path.join(__dirname, "../client");
app.use(express.static(clientPath));

app.use((req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(clientPath, "index.html"));
  } else {
    res.status(404).json({ error: "API route not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} - server.js:28`);
});