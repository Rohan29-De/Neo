# Neo — AI Dev Agent CLI

A terminal-native AI agent that integrates into your development workflow. Neo uses Groq's LLM API (Llama 3.3 70B) to assist with code understanding, debugging, documentation generation, test generation, and git automation — all from your terminal.

## Features

| Command | Description |
|---|---|
| `neo explain <file>` | Deep code analysis — overview, key functions, data flow, gotchas |
| `neo debug <file>` | Bug detection with root cause analysis and fixed code |
| `neo docgen <file>` | Auto-generates JSDoc/docstrings and saves a documented version |
| `neo test <file>` | Generates comprehensive unit tests and saves them as `*.test.js` |
| `neo commit` | Reads `git diff --staged` and writes a semantic commit message |
| `neo chat` | Interactive dev assistant REPL with optional file context |

## Tech Stack

- **Runtime**: Node.js (ESM)
- **AI**: Groq API — `llama-3.3-70b-versatile`
- **CLI**: Commander.js
- **UX**: Chalk, Ora

## Installation
```bash
git clone https://github.com/Rohan29-De/Neo.git
cd Neo
npm install
```

Create a `.env` file in the root:
```
GROQ_API_KEY=your_groq_api_key_here
```

Get a free API key at [console.groq.com](https://console.groq.com).

Link the CLI globally:
```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm link
```

## Usage
```bash
# Understand a codebase file
neo explain src/index.js

# Debug a file, optionally pass the error
neo debug src/api.js --error "TypeError: Cannot read property of undefined"

# Generate documentation
neo docgen src/utils.js
# Saves output to src/utils.documented.js

# Generate unit tests
neo test src/utils.js
# Saves output to src/utils.test.js

# Generate a semantic commit message from staged changes
git add .
neo commit

# Interactive chat mode
neo chat

# Chat with a file loaded as context
neo chat --file src/index.js
```

## Project Structure
```
Neo/
├── bin/
│   └── neo.js           # CLI entry point
├── src/
│   ├── claude.js        # Groq client wrapper
│   └── agents/
│       ├── explain.js
│       ├── debug.js
│       ├── docgen.js
│       ├── testgen.js
│       ├── commit.js
│       └── chat.js
├── .env                 # API key (not committed)
└── package.json
```

## How It Works

Each `neo` command reads the target file, constructs a role-specific system prompt, and sends it to Groq's API. Responses stream back in under a second. The `commit` command hooks into `git diff --staged` so it only sees what you're about to commit. The `chat` command maintains a readline REPL and optionally loads a file into the system context for grounded answers.

## Requirements

- Node.js v18+
- Git
- Free Groq API key
