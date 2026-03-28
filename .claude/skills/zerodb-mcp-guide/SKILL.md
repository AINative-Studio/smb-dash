---
name: zerodb-mcp-guide
description: Use ZeroDB's 76+ MCP tools for vectors, memory, NoSQL, files, and PostgreSQL. Use when (1) Setting up ZeroDB MCP server in Claude Code/Cursor, (2) Storing/searching vector embeddings, (3) Using NoSQL tables, (4) Uploading/downloading files, (5) Getting a managed PostgreSQL instance, (6) Running semantic memory search. Closes #1518.
---

# ZeroDB MCP Guide

## Install

```bash
# Full server — 76 tools (vectors, memory, NoSQL, files, PostgreSQL)
npm install -g ainative-zerodb-mcp-server

# Memory-only — 6 tools (lightweight, agents only)
npm install -g ainative-zerodb-memory-mcp
```

Or use zerodb init to auto-configure your IDE:
```bash
npx zerodb init
```

## Configure in Claude Code

```json
// .claude/mcp.json
{
  "mcpServers": {
    "zerodb": {
      "command": "ainative-zerodb-mcp-server",
      "args": [],
      "env": {
        "ZERODB_API_KEY": "ak_your_key",
        "ZERODB_PROJECT_ID": "proj_your_id"
      }
    }
  }
}
```

## Tool Categories

### Vectors (Semantic Search)
| Tool | Description |
|------|-------------|
| `zerodb-vector-upsert` | Store embedding with metadata |
| `zerodb-vector-search` | Semantic similarity search |
| `zerodb-vector-list` | List all vectors |
| `zerodb-vector-stats` | Get vector count/stats |
| `zerodb-quantum-search` | Hybrid quantum-classical search |

### Memory (Agent Context)
| Tool | Description |
|------|-------------|
| `zerodb-memory-store` | Persist agent memory |
| `zerodb-memory-search` | Recall by semantic query |
| `zerodb-memory-context` | Get current session context |

### NoSQL Tables
| Tool | Description |
|------|-------------|
| `zerodb-table-create` | Create a new table |
| `zerodb-table-list` | List all tables |
| `zerodb-table-insert` | Insert rows |
| `zerodb-table-query` | Query with filters |
| `zerodb-table-update` | Update rows |

### Files (Object Storage)
| Tool | Description |
|------|-------------|
| `zerodb-file-upload` | Upload file |
| `zerodb-file-list` | List files |
| `zerodb-file-download` | Download file |
| `zerodb-file-url` | Generate presigned URL |

### PostgreSQL (Managed)
| Tool | Description |
|------|-------------|
| `zerodb-postgres-provision` | Create dedicated PostgreSQL instance |
| `zerodb-postgres-connection` | Get connection string |
| `zerodb-postgres-status` | Check instance health |
| `zerodb-postgres-logs` | View query logs |
| `zerodb-postgres-usage` | Usage/billing stats |

### Project & Events
| Tool | Description |
|------|-------------|
| `zerodb-project-info` | Get project details |
| `zerodb-project-stats` | Usage overview |
| `zerodb-event-create` | Write to event stream |
| `zerodb-event-list` | Read event stream |

## Direct API (without MCP)

```python
import requests

API_KEY = "ak_your_key"
BASE = "https://api.ainative.studio"

# Upsert vector
requests.post(f"{BASE}/api/v1/public/zerodb/vectors/upsert",
    headers={"X-API-Key": API_KEY},
    json={
        "id": "doc-123",
        "values": [0.1, 0.2, ...],  # your embedding
        "metadata": {"text": "source content", "source": "docs"}
    })

# Semantic search
results = requests.post(f"{BASE}/api/v1/public/zerodb/vectors/search",
    headers={"X-API-Key": API_KEY},
    json={"query": "What is ZeroDB?", "top_k": 5}
).json()

# NoSQL table
requests.post(f"{BASE}/api/v1/public/zerodb/tables",
    headers={"X-API-Key": API_KEY},
    json={"name": "my_table", "schema": {"title": "string", "score": "number"}})
```

## References

- `zerodb-mcp-server/` — Full MCP server source (76 tools)
- `zerodb-memory-mcp/` — Memory-only MCP source
- `src/backend/app/api/v1/endpoints/zerodb_mcp.py` — Backend implementation
- `docs/api/ZERODB_FILE_STORAGE_GUIDE.md` — File storage deep dive
