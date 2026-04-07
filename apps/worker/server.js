import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;
const REGION = process.env.REGION || "unknown-region";

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: "worker",
    status: "ok",
    region: REGION
  });
});

app.post("/process", (req, res) => {
  const body = req.body || {};

  res.json({
    service: "worker",
    workerRegion: REGION,
    processedAt: new Date().toISOString(),
    receivedPayload: body,
    result: "Job processed successfully in remote region"
  });
});

app.listen(PORT, () => {
  console.log(`Worker listening on port ${PORT} in ${REGION}`);
});
