import fs from "fs";
import path from "path";
import { ask } from "../claude.js";
import chalk from "chalk";

export async function testgen(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`File not found: ${filePath}`));
    process.exit(1);
  }

  const code = fs.readFileSync(filePath, "utf-8");
  const ext = filePath.split(".").pop();
  const fileName = path.basename(filePath, `.${ext}`);

  const system = `You are Neo, a testing expert. Write comprehensive unit tests.
For JS: use Jest syntax. For Python: use pytest. 
Cover: happy paths, edge cases, error cases. Use descriptive test names.
Return ONLY the test code, no explanation.`;

  const user = `Generate complete unit tests for this ${ext} file:\n\n\`\`\`${ext}\n${code}\n\`\`\``;

  const result = await ask(system, user);
  console.log(chalk.magenta("\n🧪 Neo's Generated Tests:\n"));
  console.log(result);

  const outPath = path.join(path.dirname(filePath), `${fileName}.test.${ext}`);
  fs.writeFileSync(outPath, result);
  console.log(chalk.green(`\n✅ Tests saved to: ${outPath}`));
}