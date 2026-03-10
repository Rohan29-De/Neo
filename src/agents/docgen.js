import fs from "fs";
import { ask } from "../claude.js";
import chalk from "chalk";

export async function docgen(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`File not found: ${filePath}`));
    process.exit(1);
  }

  const code = fs.readFileSync(filePath, "utf-8");
  const ext = filePath.split(".").pop();

  const system = `You are Neo, a documentation expert. Generate complete, professional documentation.
For JS/TS: use JSDoc. For Python: use docstrings. Also generate a README section.
Return the fully documented version of the code followed by a README section.`;

  const user = `Generate full documentation for this ${ext} file:\n\n\`\`\`${ext}\n${code}\n\`\`\``;

  const result = await ask(system, user);
  console.log(chalk.green("\n📄 Neo's Documentation:\n"));
  console.log(result);

  // Save to file
  const outPath = filePath.replace(`.${ext}`, `.documented.${ext}`);
  const docOnly = result.split("## README")[0];
  fs.writeFileSync(outPath, docOnly);
  console.log(chalk.green(`\n✅ Documented file saved to: ${outPath}`));
}