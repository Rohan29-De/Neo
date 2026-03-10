```javascript
#!/usr/bin/env node
/**
 * @fileoverview Neo - AI Dev Agent
 * @description AI-powered dev agent for your terminal
 * @version 1.0.0
 */

import { program } from "commander";
import chalk from "chalk";
import ora from "ora";
import { explain } from "../src/agents/explain.js";
import { debug } from "../src/agents/debug.js";
import { docgen } from "../src/agents/docgen.js";
import { testgen } from "../src/agents/testgen.js";
import { commit } from "../src/agents/commit.js";
import { chat } from "../src/agents/chat.js";

/**
 * @description Prints the Neo logo to the console
 */
console.log(chalk.cyan.bold("\n⚡ Neo — AI Dev Agent\n"));

/**
 * @description Configures the Commander program
 */
program
  /**
   * @description Sets the program name
   */
  .name("neo")
  /**
   * @description Sets the program description
   */
  .description("AI-powered dev agent for your terminal")
  /**
   * @description Sets the program version
   */
  .version("1.0.0");

/**
 * @description Defines the explain command
 * @param {string} file - The file to explain
 */
program
  .command("explain <file>")
  /**
   * @description Sets the command description
   */
  .description("Understand any code file instantly")
  /**
   * @description Defines the command action
   * @param {string} file - The file to explain
   */
  .action(async (file) => {
    /**
     * @description Creates a spinner to display the analysis progress
     */
    const spinner = ora("Analyzing code...").start();
    try {
      /**
       * @description Stops the spinner
       */
      spinner.stop();
      /**
       * @description Calls the explain function
       */
      await explain(file);
    } catch (err) {
      /**
       * @description Displays an error message if the analysis fails
       */
      spinner.fail(chalk.red("Error: " + err.message));
    }
  });

/**
 * @description Defines the debug command
 * @param {string} file - The file to debug
 * @param {object} opts - The command options
 * @param {string} opts.error - The error message for context
 */
program
  .command("debug <file>")
  /**
   * @description Sets the command description
   */
  .description("Find and fix bugs in a file")
  /**
   * @description Defines the command options
   */
  .option("-e, --error <message>", "Paste the error message for context")
  /**
   * @description Defines the command action
   * @param {string} file - The file to debug
   * @param {object} opts - The command options
   */
  .action(async (file, opts) => {
    /**
     * @description Creates a spinner to display the debugging progress
     */
    const spinner = ora("Debugging...").start();
    try {
      /**
       * @description Stops the spinner
       */
      spinner.stop();
      /**
       * @description Calls the debug function
       */
      await debug(file, opts.error);
    } catch (err) {
      /**
       * @description Displays an error message if the debugging fails
       */
      spinner.fail(chalk.red("Error: " + err.message));
    }
  });

/**
 * @description Defines the docgen command
 * @param {string} file - The file to generate documentation for
 */
program
  .command("docgen <file>")
  /**
   * @description Sets the command description
   */
  .description("Auto-generate documentation for a file")
  /**
   * @description Defines the command action
   * @param {string} file - The file to generate documentation for
   */
  .action(async (file) => {
    /**
     * @description Creates a spinner to display the documentation generation progress
     */
    const spinner = ora("Generating docs...").start();
    try {
      /**
       * @description Stops the spinner
       */
      spinner.stop();
      /**
       * @description Calls the docgen function
       */
      await docgen(file);
    } catch (err) {
      /**
       * @description Displays an error message if the documentation generation fails
       */
      spinner.fail(chalk.red("Error: " + err.message));
    }
  });

/**
 * @description Defines the test command
 * @param {string} file - The file to generate tests for
 */
program
  .command("test <file>")
  /**
   * @description Sets the command description
   */
  .description("Generate unit tests for a file")
  /**
   * @description Defines the command action
   * @param {string} file - The file to generate tests for
   */
  .action(async (file) => {
    /**
     * @description Creates a spinner to display the test generation progress
     */
    const spinner = ora("Writing tests...").start();
    try {
      /**
       * @description Stops the spinner
       */
      spinner.stop();
      /**
       * @description Calls the testgen function
       */
      await testgen(file);
    } catch (err) {
      /**
       * @description Displays an error message if the test generation fails
       */
      spinner.fail(chalk.red("Error: " + err.message));
    }
  });

/**
 * @description Defines the commit command
 */
program
  .command("commit")
  /**
   * @description Sets the command description
   */
  .description("Generate a semantic commit message from staged changes")
  /**
   * @description Defines the command action
   */
  .action(async () => {
    /**
     * @description Creates a spinner to display the commit message generation progress
     */
    const spinner = ora("Reading git diff...").start();
    try {
      /**
       * @description Stops the spinner
       */
      spinner.stop();
      /**
       * @description Calls the commit function
       */
      await commit();
    } catch (err) {
      /**
       * @description Displays an error message if the commit message generation fails
       */
      spinner.fail(chalk.red("Error: " + err.message));
    }
  });

/**
 * @description Defines the chat command
 * @param {object} opts - The command options
 * @param {string} opts.file - The file to load as context for the conversation
 */
program
  .command("chat")
  /**
   * @description Sets the command description
   */
  .description("Interactive dev assistant (optional: load file as context)")
  /**
   * @description Defines the command options
   */
  .option("-f, --file <path>", "Load a file as context for the conversation")
  /**
   * @description Defines the command action
   * @param {object} opts - The command options
   */
  .action(async (opts) => {
    /**
     * @description Calls the chat function
     */
    await chat(opts.file);
  });

/**
 * @description Parses the command-line arguments
 */
program.parse();

```

