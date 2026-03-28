---
name: zeromemory-guide
description: Add persistent cognitive memory to AI agents with ZeroMemory. Use when (1) Storing facts, conversations, or events an agent should remember, (2) Searching agent memory by meaning (semantic recall), (3) Building user profiles from memories, (4) Creating knowledge graphs from relationships, (5) Giving agents context across sessions. Covers remember/recall/forget/reflect/relate/graph API. Closes #1521.
---

# ZeroMemory Guide

ZeroMemory is a cognitive memory layer for AI agents — store facts, conversations, and events; recall them semantically; build profiles and knowledge graphs.

## Base URL

```
https://api.ainative.studio/api/v1/public/memory/v2/
```

**Auth:** `X-API-Key: ak_...` or `Authorization: Bearer <jwt>`

## Memory Types

| Type | Use Case |
|------|----------|
| `working` | Short-term task context (current session) |
| `episodic` | Events and experiences over time |
| `semantic` | Facts, knowledge, general truths |

## Store a Memory

```python
import requests

API_KEY = "ak_your_key"
BASE = "https://api.ainative.studio/api/v1/public/memory/v2"

# Remember a fact
resp = requests.post(f"{BASE}/remember",
    headers={"X-API-Key": API_KEY},
    json={
        "content": "User prefers Python over JavaScript for backend work",
        "entity_id": "user-456",
        "memory_type": "semantic",
        "importance": 0.8,
        "tags": ["preferences", "programming"]
    }
)
memory_id = resp.json()["memory_id"]
```

## Recall by Meaning

```python
# Semantic search — finds memories by meaning, not exact text
results = requests.post(f"{BASE}/recall",
    headers={"X-API-Key": API_KEY},
    json={
        "query": "What does the user like to program in?",
        "entity_id": "user-456",
        "limit": 5
    }
).json()

for memory in results["memories"]:
    print(f"[{memory['score']:.2f}] {memory['content']}")
```

## Forget a Memory

```python
requests.delete(f"{BASE}/forget/{memory_id}",
    headers={"X-API-Key": API_KEY})
```

## Reflect — Build Insights

```python
# Get distilled insights from an entity's memories
insights = requests.post(f"{BASE}/reflect/user-456",
    headers={"X-API-Key": API_KEY}
).json()
print(insights["summary"])
```

## Profile — Build User Model

```python
# Construct a profile from all memories about an entity
profile = requests.get(f"{BASE}/profile",
    headers={"X-API-Key": API_KEY},
    params={"entity_id": "user-456"}
).json()
print(profile["interests"])
print(profile["preferences"])
```

## Relate — Knowledge Graph Edges

```python
# Create a relationship between two entities
requests.post(f"{BASE}/relate",
    headers={"X-API-Key": API_KEY},
    json={
        "subject": "user-456",
        "predicate": "works_at",
        "object": "AINative Studio",
        "confidence": 0.95
    }
)
```

## Graph — Explore Knowledge Graph

```python
graph = requests.get(f"{BASE}/graph",
    headers={"X-API-Key": API_KEY},
    params={"entity_id": "user-456", "depth": 2}
).json()

for node in graph["nodes"]:
    print(f"{node['id']}: {node['type']}")
for edge in graph["edges"]:
    print(f"{edge['subject']} --[{edge['predicate']}]--> {edge['object']}")
```

## MCP Usage (via zerodb-memory-mcp)

```bash
npm install -g ainative-zerodb-memory-mcp
```

```json
// .claude/mcp.json
{
  "mcpServers": {
    "memory": {
      "command": "ainative-zerodb-memory-mcp",
      "env": { "ZERODB_API_KEY": "ak_your_key" }
    }
  }
}
```

MCP tools: `zerodb-memory-store`, `zerodb-memory-search`, `zerodb-memory-context`, `zerodb-rlhf-feedback`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/remember` | POST | Store a memory |
| `/recall` | POST | Semantic search |
| `/forget/{id}` | DELETE | Remove memory |
| `/reflect/{entity_id}` | POST | Generate insights |
| `/profile` | GET | Build entity profile |
| `/relate` | POST | Add graph relationship |
| `/graph` | GET | Query knowledge graph |
| `/process` | POST | Batch process memories |

## References

- `src/backend/app/api/v1/endpoints/zeromemory.py` — API implementation
- `src/backend/app/services/memory/zeromemory.py` — ZeroMemory service
- `src/backend/app/services/memory/scoring.py` — Memory scoring logic
- `docs/guides/MEMORY_API_DEVELOPER_GUIDE.md` — Embedding/JSON patterns
- `docs/architecture/MEMORY_EMBEDDING_STORAGE.md` — Architecture design
