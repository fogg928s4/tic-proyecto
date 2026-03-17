import express from "express";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

const webhook = process.env.API_URL || "http://localhost:8080/api/solicitudes";
app.get("/send", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;
    const { name, reason, date, email, priority } = req.query;

    if (!name || !reason || !date || !email || !priority) {
      return res.status(400).json({ error: "Missing required parameters: name, reason, date, email, priority" });
    }

    const webhookURL = new URL(webhook);
    webhookURL.searchParams.append("name", name as string);
    webhookURL.searchParams.append("reason", reason as string);
    webhookURL.searchParams.append("date", date as string);
    webhookURL.searchParams.append("email", email as string);
    webhookURL.searchParams.append("priority", priority as string);

    const response = await fetch(webhookURL.toString(), {
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
  console.log(`Send GET requests to http://localhost:${PORT}/send with query parameters: apiUrl, name, reason, date, email, priority`);
});
