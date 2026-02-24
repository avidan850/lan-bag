// server.ts (Express + TypeScript)
// npm i express
// npm i -D typescript ts-node @types/node @types/express
// Node 18+ recommended (built-in fetch). If Node < 18: npm i node-fetch and import it.

import express, { Request, Response } from "express";
import path from "path";
import fs from "fs"; 


const app = express();
app.use(express.json());


// ✅ Always resolve from where you start the process (project root)
const publicDir = path.resolve(process.cwd(), "public");
const indexPath = path.join(publicDir, "index.html");

console.log("📁 publicDir:", publicDir);
console.log("📄 indexPath:", indexPath);
console.log("✅ index exists:", fs.existsSync(indexPath));

app.use(express.static(publicDir, { index: 'index.html' }));

const webhookUrl =
  "https://hook.eu2.make.com/3whu1ldxk5tjbw1o6kf9a6abi1tbhlbu";

app.post("/api/send", async (req: Request, res: Response) => {
  const { name, phone, message } = req.body ?? {};

  console.log("Received request:", { name, phone, message });

  // Basic validation (optional but recommended)
  if (
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({ error: "Invalid body. Expect {name, phone, message} strings." });
  }

  try {
    console.log("Sending data to webhook...");

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, message }),
    });

    const responseText = await response.text();
    console.log("Webhook response text:", responseText);

    if (!response.ok) {
      console.error("Webhook response error:", response.status, responseText);
      return res.status(500).json({ error: "Webhook failed" });
    }

    console.log("Webhook call successful.");
    return res.json({ success: true, message: responseText });
  } catch (error) {
    console.error("Catch block error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
});

// Serve index.html for the root route
app.get("/", (_req: Request, res: Response) => {
  try {
    const html = fs.readFileSync(indexPath, "utf8");
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error("Error reading index.html:", error);
    res.status(500).send("Error loading page");
  }
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Express listening on http://localhost:${port}`);
});
