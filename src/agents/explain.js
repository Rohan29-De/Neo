import fs from "fs";
import { ask } from "../claude.js";
import chalk from "chalk";

export async function explain(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`File not found: ${filePath}`));
    process.exit(1);
  }

  const code = fs.readFileSync(filePath, "utf-8");
  const ext = filePath.split(".").pop();

  const system = `You are Neo, an expert AI dev agent. You analyze code with surgical precision. 
Be concise but thorough. Use sections: Overview, Key Functions, Data Flow, Gotchas.`;

  const user = `Explain this ${ext} file in detail:\n\n\`\`\`${ext}\n${code}\n\`\`\``;

  const result = await ask(system, user);
  console.log(chalk.cyan("\n🧠 Neo's Analysis:\n"));
  console.log(result);
}