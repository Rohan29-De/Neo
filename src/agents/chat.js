import readline from "readline";
import fs from "fs";
import { ask } from "../claude.js";
import chalk from "chalk";

export async function chat(contextFile) {
  let context = "";
  if (contextFile && fs.existsSync(contextFile)) {
    context = fs.readFileSync(contextFile, "utf-8");
    console.log(chalk.gray(`📎 Context loaded: ${contextFile}`));
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const system = `You are Neo, an expert AI dev agent assistant embedded in the developer's terminal.
You help with code, architecture, debugging, best practices, and anything dev-related.
Be concise and technical. No fluff.
${context ? `\nFile context the developer has open:\n\`\`\`\n${context}\n\`\`\`` : ""}`;

  console.log(chalk.cyan("\n🤖 Neo is ready. Type your question (or 'exit' to quit)\n"));

  const askQuestion = () => {
    rl.question(chalk.green("you → "), async (input) => {
      if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
        console.log(chalk.cyan("Neo signing off. 👋"));
        rl.close();
        return;
      }

      if (!input.trim()) {
        askQuestion();
        return;
      }

      try {
        const response = await ask(system, input);
        console.log(chalk.cyan("\nneo → ") + response + "\n");
      } catch (err) {
        console.log(chalk.red("Error: " + err.message));
      }

      askQuestion();
    });
  };

  askQuestion();
}