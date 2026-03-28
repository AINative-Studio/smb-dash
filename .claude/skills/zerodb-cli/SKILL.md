---
name: zerodb-cli
description: Use zerodb-cli to instantly set up a ZeroDB project and auto-configure your IDE's MCP server. Use when (1) Starting a new project that needs AI database access, (2) Setting up ZeroDB for Claude Code, Cursor, VS Code, or Windsurf, (3) Getting a new API key and project in 30 seconds, (4) Configuring MCP servers without manual JSON editing. npx zerodb init handles everything automatically.
---

# zerodb-cli

Zero-config project setup and IDE auto-configuration for ZeroDB.

## Quick Start

```bash
npx zerodb init
```

This single command:
1. Creates an instant ZeroDB project (no account required)
2. Generates an API key
3. Auto-detects your editor (Claude Code, Cursor, VS Code, Windsurf)
4. Writes the MCP configuration to the right place

## What Gets Configured

| Editor | Config File Written |
|--------|-------------------|
| Claude Code | `.claude/mcp.json` |
| Cursor | `.cursor/mcp.json` |
| VS Code | `.vscode/mcp.json` |
| Windsurf | `.windsurf/mcp.json` |

The config looks like:
```json
{
  "mcpServers": {
    "zerodb": {
      "command": "ainative-zerodb-mcp-server",
      "env": {
        "ZERODB_API_KEY": "ak_generated_key",
        "ZERODB_PROJECT_ID": "proj_generated_id"
      }
    }
  }
}
```

## Options

```bash
# Use an existing API key + project
npx zerodb init --api-key ak_existing_key --project-id proj_existing_id

# Target a specific editor
npx zerodb init --editor claude-code
npx zerodb init --editor cursor
npx zerodb init --editor vscode
npx zerodb init --editor windsurf
```

## Install Globally (Optional)

```bash
npm install -g zerodb-cli
zerodb init
```

## After Init

Once configured, your AI agent has immediate access to all 76 ZeroDB MCP tools:

```
# In Claude Code, you can now ask:
"Store this document as a vector embedding"
"Search my memories for anything about authentication"
"Create a table called users"
"Upload this file to ZeroDB storage"
```

## What's Created on the Server

```json
{
  "project_id": "proj_abc123",
  "api_key": "ak_...",
  "project_name": "My Project",
  "endpoints": {
    "vectors": "https://api.ainative.studio/api/v1/public/zerodb/vectors",
    "memory": "https://api.ainative.studio/api/v1/public/memory/v2",
    "files": "https://api.ainative.studio/api/v1/public/zerodb/files",
    "tables": "https://api.ainative.studio/api/v1/public/zerodb/tables"
  }
}
```

## Python CLI (zerodb-cli on PyPI)

```bash
pip install zerodb-cli
```

Provides the same init command plus additional management features for Python projects.

## References

- `packages/zerodb-cli/src/cli.js` — CLI implementation
- `packages/zerodb-cli/package.json` — Package config
- `zerodb-mcp-guide` skill — Full list of 76 MCP tools available after init
- API: `POST /api/v1/public/instant-db` — Instant project creation endpoint
