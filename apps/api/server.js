import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;
const REGION = process.env.REGION || "unknown-region";
const WORKER_URL = process.env.WORKER_URL || "";

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: "api",
    status: "ok",
    region: REGION
  });
});

app.get("/message", (req, res) => {
  res.json({
    service: "api",
    region: REGION,
    message: "Hello from the API service",
    timestamp: new Date().toISOString()
  });
});

app.post("/jobs", async (req, res) => {
  const payload = req.body || {};

  if (!WORKER_URL) {
    return res.status(500).json({
      error: "WORKER_URL is not configured",
      region: REGION
    });
  }

  try {
    const response = await fetch(`${WORKER_URL}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requestedBy: "api",
        apiRegion: REGION,
        payload
      })
    });

    const data = await response.json();

    res.json({
      apiRegion: REGION,
      workerResponse: data
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to call worker service",
      details: error.message,
      apiRegion: REGION
    });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT} in ${REGION}`);
});
