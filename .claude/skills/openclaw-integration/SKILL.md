---
name: openclaw-integration
description: Dispatch tasks to OpenClaw AI agents from Claude Code (Cody mode). Use when (1) Sending tasks to specialized agents (aurora=QA, sage=backend, nova=security, atlas=infra), (2) Checking agent swarm status, (3) Using ACP for persistent agent sessions, (4) Orchestrating multi-agent workflows from the terminal, (5) Cody needs to delegate work to a subagent.
---

# OpenClaw Integration

Cody controls a 9-agent OpenClaw swarm from the Claude Code terminal.

## Agent Roster

| Agent | ID | Best For |
|-------|-----|---------|
| Main | `main` | Default routing, orchestration |
| Atlas Redwood | `atlas` | Infrastructure, Railway, deployments |
| Lyra Chen-Sato | `lyra` | Frontend, UI, React/Next.js |
| Sage Okafor | `sage` | Backend, FastAPI, APIs |
| Vega Martinez | `vega` | Data, analytics, reporting |
| Nova Sinclair | `nova` | Security, auth, OWASP |
| Luma Harrington | `luma` | Documentation, guides |
| Helios Mercer | `helios` | Performance, optimization |
| Aurora Vale | `aurora` | Testing, QA, coverage |

## Quick Dispatch

```bash
# Via Cody script (recommended)
python3 scripts/cody_openclaw.py dispatch --agent aurora --task "Write tests for billing module"
python3 scripts/cody_openclaw.py dispatch --agent sage --task "Add rate limiting to credits endpoint"
python3 scripts/cody_openclaw.py dispatch --agent nova --task "Security audit of auth.py"
python3 scripts/cody_openclaw.py dispatch --agent atlas --task "Check Railway deploy logs for errors"

# Direct openclaw CLI
openclaw agent --agent aurora --message "Run the test suite and report coverage"
openclaw agent --agent main --message "Review PR #1512 for issues"
```

## Status Check

```bash
python3 scripts/cody_openclaw.py status    # Gateway health + active agents
python3 scripts/cody_openclaw.py agents    # List all agents with status
```

## ACP Session (Persistent Context)

```bash
# Connect to a persistent ACP session
openclaw acp --session agent:main:main --token YOUR_TOKEN

# Via cody script
python3 scripts/cody_openclaw.py acp --session agent:main:main
```

## Live Logs

```bash
python3 scripts/cody_openclaw.py logs --follow
```

## /openclaw-dispatch Command

In Claude Code, use the slash command for guided dispatch:

```
/openclaw-dispatch
```

Prompts you to select an agent and enter a task. Handles routing automatically.

## /openclaw-status Command

```
/openclaw-status
```

Shows gateway health and all agent statuses.

## Gateway Config

- Gateway: `ws://127.0.0.1:18789`
- Token: stored in `~/.openclaw/openclaw.json`
- 9 agents registered, ACP enabled via `acpx` plugin

## Python Integration

```python
import subprocess

def dispatch_to_agent(agent_id: str, task: str):
    """Dispatch a task to an OpenClaw agent."""
    subprocess.run(
        ["openclaw", "agent", "--agent", agent_id, "--message", task],
        capture_output=False  # Must be False — openclaw streams to TTY
    )

# Route by task type
routing = {
    "test": "aurora",
    "security": "nova",
    "deploy": "atlas",
    "frontend": "lyra",
    "backend": "sage",
    "performance": "helios",
    "data": "vega",
    "docs": "luma",
}

def smart_dispatch(task: str):
    for keyword, agent in routing.items():
        if keyword in task.lower():
            return dispatch_to_agent(agent, task)
    dispatch_to_agent("main", task)
```

> **Note:** Always use `capture_output=False` when calling `openclaw agent` — it streams output to TTY and will timeout with capture enabled.

## References

- `scripts/cody_openclaw.py` — Cody's control script (status, agents, dispatch, acp, logs)
- `.claude/commands/openclaw-dispatch.md` — /openclaw-dispatch command
- `.claude/commands/openclaw-status.md` — /openclaw-status command
- `~/.openclaw/openclaw.json` — Gateway token and agent registry
- `ainative-agent-framework` skill — Multi-agent architecture overview
