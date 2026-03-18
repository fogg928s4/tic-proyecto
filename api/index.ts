import express from "express";
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://webhook.my-domain.com";

app.get("/send", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;
    const { name, reason, date, email, priority } = req.query;

    if (!name || !reason || !date || !email || !priority) {
      return res.status(400).json({ error: "Missing required parameters: name, reason, date, email, priority" });
    }

    const url = new URL(WEBHOOK_URL);
    url.searchParams.append("name", name as string);
    url.searchParams.append("reason", reason as string);
    url.searchParams.append("date", date as string);
    url.searchParams.append("email", email as string);
    url.searchParams.append("priority", priority as string);

    const response = await fetch(url.toString(), {
      method: "GET",
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
  res.status(404).json({ message: "Only GET /send is supported." });
});

app.listen(PORT, () => {
  console.log(`Proxy API running on http://localhost:${PORT}`);
  console.log(`Send GET requests to http://localhost:${PORT}/send with query parameters: name, reason, date, email, priority`);
});
