```javascript
import { program } from "commander";
import chalk from "chalk";
import ora from "ora";
import { explain } from "../src/agents/explain.js";
import { debug } from "../src/agents/debug.js";
import { docgen } from "../src/agents/docgen.js";
import { testgen } from "../src/agents/testgen.js";
import { commit } from "../src/agents/commit.js";
import { chat } from "../src/agents/chat.js";

describe("Neo CLI", () => {
  describe("Initialization", () => {
    it("should log the Neo banner", () => {
      console.log = jest.fn();
      require("../src/index.js");
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(chalk.cyan.bold("\n⚡ Neo — AI Dev Agent\n"));
    });
  });

  describe("Commands", () => {
    describe("explain", () => {
      it("should call explain function with file path", async () => {
        const explainSpy = jest.spyOn(require("../src/agents/explain.js"), "explain");
        program.parse(["node", "neo", "explain", "test.js"]);
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(explainSpy).toHaveBeenCalledTimes(1);
        expect(explainSpy).toHaveBeenCalledWith("test.js");
      });

      it("should handle errors in explain function", async () => {
        const explainSpy = jest.spyOn(require("../src/agents/explain.js"), "explain");
        explainSpy.mockRejectedValue(new Error("Test error"));
        const consoleErrorSpy = jest.spyOn(console, "error");
        program.parse(["node", "neo", "explain", "test.js"]);
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith(chalk.red("Error: Test error"));
      });
    });

    describe("debug", () => {
      it("should call debug function with file path and error message", async () => {
        const debugSpy = jest.spyOn(require("../src/agents/debug.js"), "debug");
        program.parse(["node", "neo", "debug", "test.js", "-e", "Test error"]);
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(debugSpy).toHaveBeenCalledTimes(1);
        expect(debugSpy).toHaveBeenCalledWith("test.js", "Test error");
      });

      it("should handle errors in debug function", async () => {
        const debugSpy = jest.spyOn(require("../src/agents/debug.js"), "debug");
        debugSpy.mockRejectedValue(new Error("Test error"));
        const consoleErrorSpy = jest.spyOn(console, "error");
        program.parse(["node", "neo", "debug", "test.js", "-e", "Test error"]);
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith(chalk.red("Error: Test error"));
      });
    });

    describe("docgen", () => {
      it("should call docgen function with file path", async () => {
        const docgenSpy = jest.spyOn(require("../src/agents/docgen.js"), "docgen");
        program.parse(["node", "neo", "docgen", "test.js"]);
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(docgenSpy).toHaveBeenCalledTimes(1);
        expect(docgenSpy).toHaveBeenCalledWith("test.js");
      });

      it("should handle errors in docgen function", async () => {
        const docgenSpy = jest.spyOn(require("../src/agents/docgen.js"), "docgen");
        docgenSpy.mockRejectedValue(new Error("Test error"));
        const consoleErrorSpy = jest.spyOn(console, "error");
        program.parse(["node", "neo", "docgen", "test.js"]);
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith(chalk.red("Error: Test error"));
      });
    });

    describe("test", () => {
      it("should call testgen function with file path", async () => {
        const testgenSpy = jest.spyOn(require("../src/agents/testgen.js"), "testgen");
        program.parse(["node", "neo", "test", "test.js"]);
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(testgenSpy).toHaveBeenCalledTimes(1);
        expect(testgenSpy).toHaveBeenCalledWith("test.js");
      });

      it("should handle errors in testgen function", async () => {
        const testgenSpy = jest.spyOn(require("../src/agents/testgen.js"), "testgen");
        testgenSpy.mockRejectedValue(new Error("Test error"));
        const consoleErrorSpy = jest.spyOn(console, "error");
        program.parse(["node", "neo", "test", "test.js"]);
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith(chalk.red("Error: Test error"));
      });
    });

    describe("commit", () => {
      it("should call commit function", async () => {
        const commitSpy = jest.spyOn(require("../src/agents/commit.js"), "commit");
        program.parse(["node", "neo", "commit"]);
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(commitSpy).toHaveBeenCalledTimes(1);
      });

      it("should handle errors in commit function", async () => {
        const commitSpy = jest.spyOn(require("../src/agents/commit.js"), "commit");
        commitSpy.mockRejectedValue(new Error("Test error"));
        const consoleErrorSpy = jest.spyOn(console, "error");
        program.parse(["node", "neo", "commit"]);
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith(chalk.red("Error: Test error"));
      });
    });

    describe("chat", () => {
      it("should call chat function with file path", async () => {
        const chatSpy = jest.spyOn(require("../src/agents/chat.js"), "chat");
        program.parse(["node", "neo", "chat", "-f", "test.js"]);
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(chatSpy).toHaveBeenCalledTimes(1);
        expect(chatSpy).toHaveBeenCalledWith("test.js");
      });

      it("should call chat function without file path", async () => {
        const chatSpy = jest.spyOn(require("../src/agents/chat.js"), "chat");
        program.parse(["node", "neo", "chat"]);
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(chatSpy).toHaveBeenCalledTimes(1);
        expect(chatSpy).toHaveBeenCalledWith(undefined);
      });
    });
  });
});
```