import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 8080;
const REGION = process.env.REGION || "unknown-region";
const API_URL = process.env.API_URL || "http://api:8080";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({
    service: "frontend",
    status: "ok",
    region: REGION
  });
});

app.get("/config", (req, res) => {
  res.json({
    service: "frontend",
    region: REGION,
    apiUrl: API_URL
  });
});

app.get("/api/message", async (req, res) => {
  try {
    const response = await fetch(`${API_URL}/message`);
    const data = await response.json();

    res.json({
      frontendRegion: REGION,
      apiResponse: data
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to call API service",
      details: error.message,
      frontendRegion: REGION
    });
  }
});

app.listen(PORT, () => {
  console.log(`Frontend listening on port ${PORT} in ${REGION}`);
});
