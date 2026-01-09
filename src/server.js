const express = require("express");
const fs = require("fs");
const cors = require('cors');
const path = require("path");

const app = express();
const PORT = 3000;

const CHAIN_FILE = path.join(__dirname, "blockchain.json");

// Allow frontend to fetch
app.use(express.json());
app.use(express.static("public")); // optional
app.use(cors())

app.get("/blockchain", (req, res) => {
  if (!fs.existsSync(CHAIN_FILE)) {
    return res.status(404).json({ error: "Blockchain not found" });
  }

  const data = fs.readFileSync(CHAIN_FILE, "utf-8");
  res.json(JSON.parse(data));
});

app.listen(PORT, () => {
  console.log(`Blockchain node running at http://localhost:${PORT}`);
});

