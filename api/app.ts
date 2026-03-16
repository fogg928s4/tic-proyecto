import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

app.post("/send", async (req, res) => {
  try {
    const { apiUrl, ...data } = req.body;

    if (!apiUrl || typeof apiUrl !== "string") {
      return res.status(400).json({ error: "Missing or invalid apiUrl in request body" });
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get("content-type") || "";
    const responseBody = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    res.status(response.status).send(responseBody);
  } catch (error) {
    console.error("Error forwarding request:", error);
    res.status(500).json({ error: "Request forwarding failed", details: error instanceof Error ? error.message : error });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Only POST /send is supported." });
});

app.listen(PORT, () => {
  console.log(`Proxy API running on http://localhost:${PORT}`);
  console.log(`Send POST requests to http://localhost:${PORT}/send with JSON body { apiUrl: 'https://target/api', ...data }`);
});
