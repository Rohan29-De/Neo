import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
import chalk from "chalk";

// configure a terminal-friendly markdown renderer
const terminalRenderer = new TerminalRenderer({
  heading: (txt, level) => chalk.cyan.bold(txt),
  firstHeading: (txt) => chalk.cyan.bold.underline(txt),
  strong: chalk.white.bold,
  em: chalk.italic,
  codespan: chalk.yellow,
  code: chalk.green,
  listitem: chalk.white,
  hr: chalk.gray,
  showSectionPrefix: false, // don’t print the leading `#` characters
  reflowText: true,         // wrap text to terminal width
});

marked.setOptions({
  renderer: terminalRenderer,
  gfm: true,
  breaks: true,
});

export function render(text) {
  if (!text) return;
  // use parse so the options above are honoured
  console.log(marked.parse(text));
}