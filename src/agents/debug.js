import { render } from "../render.js";
import fs from "fs";
import { ask } from "../claude.js";
import chalk from "chalk";

export async function debug(filePath, errorMsg) {
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`File not found: ${filePath}`));
    process.exit(1);
  }

  const code = fs.readFileSync(filePath, "utf-8");
  const ext = filePath.split(".").pop();

  const system = `You are Neo, an expert debugger. Find bugs, explain root cause, and provide fixed code.
Format: 
## Bugs Found
## Root Cause  
## Fixed Code
## What Changed`;

  const user = `Debug this ${ext} file.
${errorMsg ? `Error message: ${errorMsg}\n` : ""}
\`\`\`${ext}
${code}
\`\`\``;

  const result = await ask(system, user);
  console.log(chalk.yellow("\n🐛 Neo's Debug Report:\n"));
  render(result);
}