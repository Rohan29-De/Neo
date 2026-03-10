import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config({ path: "../.env" });

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json({ limit: "10mb" }));

async function ask(systemPrompt, userPrompt) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 4096,
  });
  return response.choices[0].message.content;
}

app.post("/api/explain", async (req, res) => {
  const { code, filename } = req.body;
  const ext = filename?.split(".").pop() || "js";
  const system = `You are Neo, an expert AI dev agent. You analyze code with surgical precision.
Use sections: ## Overview, ## Key Functions, ## Data Flow, ## Gotchas. Use markdown formatting.`;
  const user = `Explain this ${ext} file:\n\n\`\`\`${ext}\n${code}\n\`\`\``;
  try {
    const result = await ask(system, user);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/debug", async (req, res) => {
  const { code, filename, error } = req.body;
  const ext = filename?.split(".").pop() || "js";
  const system = `You are Neo, an expert debugger. Find bugs, explain root cause, provide fixed code.
Use sections: ## Bugs Found, ## Root Cause, ## Fixed Code, ## What Changed. Use markdown.`;
  const user = `Debug this ${ext} file.\n${error ? `Error: ${error}\n` : ""}\n\`\`\`${ext}\n${code}\n\`\`\``;
  try {
    const result = await ask(system, user);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/docgen", async (req, res) => {
  const { code, filename } = req.body;
  const ext = filename?.split(".").pop() || "js";
  const system = `You are Neo, a documentation expert. Generate complete professional documentation.
For JS/TS use JSDoc. For Python use docstrings. Use markdown formatting.`;
  const user = `Generate full documentation for this ${ext} file:\n\n\`\`\`${ext}\n${code}\n\`\`\``;
  try {
    const result = await ask(system, user);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/testgen", async (req, res) => {
  const { code, filename } = req.body;
  const ext = filename?.split(".").pop() || "js";
  const system = `You are Neo, a testing expert. Write comprehensive unit tests.
For JS use Jest. For Python use pytest. Cover happy paths, edge cases, error cases. Use markdown.`;
  const user = `Generate complete unit tests for this ${ext} file:\n\n\`\`\`${ext}\n${code}\n\`\`\``;
  try {
    const result = await ask(system, user);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/chat", async (req, res) => {
  const { messages, context } = req.body;
  const system = `You are Neo, an expert AI dev agent assistant.
You help with code, architecture, debugging, best practices. Be concise and technical.
${context ? `\nCode context:\n\`\`\`\n${context}\n\`\`\`` : ""}`;
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.3,
      max_tokens: 4096,
    });
    res.json({ result: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("Neo server running on http://localhost:3001"));