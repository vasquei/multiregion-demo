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
    region: REGION,
    workerUrl: WORKER_URL
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
      apiRegion: REGION
    });
  }

  try {
    const response = await fetch(`${WORKER_URL}:${PORT}/process`, {
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

    const workerData = await response.json();

    res.json({
      success: true,
      apiRegion: REGION,
      workerCalled: true,
      workerUrl: WORKER_URL,
      workerResponse: workerData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      apiRegion: REGION,
      workerCalled: false,
      workerUrl: WORKER_URL,
      error: "Failed to call worker service",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT} in ${REGION}`);
});
