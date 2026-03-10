#!/usr/bin/env node
import { program } from "commander";
import chalk from "chalk";
import ora from "ora";
import { explain } from "../src/agents/explain.js";
import { debug } from "../src/agents/debug.js";
import { docgen } from "../src/agents/docgen.js";
import { testgen } from "../src/agents/testgen.js";
import { commit } from "../src/agents/commit.js";
import { chat } from "../src/agents/chat.js";

console.log(chalk.cyan.bold("\n⚡ Neo — AI Dev Agent\n"));

program
  .name("neo")
  .description("AI-powered dev agent for your terminal")
  .version("1.0.0");

program
  .command("explain <file>")
  .description("Understand any code file instantly")
  .action(async (file) => {
    const spinner = ora("Analyzing code...").start();
    try {
      spinner.stop();
      await explain(file);
    } catch (err) {
      spinner.fail(chalk.red("Error: " + err.message));
    }
  });

program
  .command("debug <file>")
  .description("Find and fix bugs in a file")
  .option("-e, --error <message>", "Paste the error message for context")
  .action(async (file, opts) => {
    const spinner = ora("Debugging...").start();
    try {
      spinner.stop();
      await debug(file, opts.error);
    } catch (err) {
      spinner.fail(chalk.red("Error: " + err.message));
    }
  });

program
  .command("docgen <file>")
  .description("Auto-generate documentation for a file")
  .action(async (file) => {
    const spinner = ora("Generating docs...").start();
    try {
      spinner.stop();
      await docgen(file);
    } catch (err) {
      spinner.fail(chalk.red("Error: " + err.message));
    }
  });

program
  .command("test <file>")
  .description("Generate unit tests for a file")
  .action(async (file) => {
    const spinner = ora("Writing tests...").start();
    try {
      spinner.stop();
      await testgen(file);
    } catch (err) {
      spinner.fail(chalk.red("Error: " + err.message));
    }
  });

program
  .command("commit")
  .description("Generate a semantic commit message from staged changes")
  .action(async () => {
    const spinner = ora("Reading git diff...").start();
    try {
      spinner.stop();
      await commit();
    } catch (err) {
      spinner.fail(chalk.red("Error: " + err.message));
    }
  });

program
  .command("chat")
  .description("Interactive dev assistant (optional: load file as context)")
  .option("-f, --file <path>", "Load a file as context for the conversation")
  .action(async (opts) => {
    await chat(opts.file);
  });

program.parse();