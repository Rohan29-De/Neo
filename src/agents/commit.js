import { render } from "../render.js";
import { execSync } from "child_process";
import { ask } from "../claude.js";
import chalk from "chalk";

export async function commit() {
  let diff;
  try {
    diff = execSync("git diff --staged", {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch (e) {
    console.log(chalk.red("Git error: " + e.message));
    process.exit(1);
  }

  if (!diff.trim()) {
    console.log(chalk.yellow("No staged changes found. Run: git add <files> first."));
    process.exit(0);
  }

  // Truncate if too large
  if (diff.length > 8000) {
    diff = diff.slice(0, 8000) + "\n\n[diff truncated for brevity...]";
  }

  const system = `You are Neo, a git expert. Generate a semantic commit message.
Format: <type>(<scope>): <short description>

Types: feat, fix, docs, style, refactor, test, chore
Rules:
- First line max 72 chars
- Add body if changes are complex (blank line between subject and body)
- Be specific, not generic
Return ONLY the commit message, nothing else.`;

  const user = `Generate a commit message for this diff:\n\n${diff}`;

  try {
    const result = await ask(system, user);
    console.log(chalk.blue("\n📝 Neo's Commit Message:\n"));
    render(result);
    console.log(chalk.gray('\n→ To use it: git commit -m "' + result.split("\n")[0] + '"'));
  } catch (err) {
    console.log(chalk.red("Error: " + err.message));
  }
}