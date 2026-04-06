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

  const result = {
    service: "worker",
    workerRegion: REGION,
    receivedAt: new Date().toISOString(),
    receivedPayload: body,
    result: {
      status: "processed",
      summary: "The job was processed successfully in the remote region"
    }
  };

  console.log("Processed job:", JSON.stringify(result, null, 2));

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Worker listening on port ${PORT} in ${REGION}`);
});
