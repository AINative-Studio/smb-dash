---
name: port-management
description: Manage local development port conflicts using DevManager CLI. Use when (1) Port conflicts occur, (2) Checking what services are running locally, (3) Registering new dev services, (4) Resolving port collisions.
---

# Port Management Skill (DevManager Integration)

**USE THIS SKILL** when you need to help developers manage local port conflicts and see what's running on their machine.

## Overview

This skill integrates with **DevManager**, a TypeScript CLI tool that:
- Tracks all local dev services in ZeroDB
- Detects port conflicts automatically
- Resolves conflicts based on user preference (kill/reassign/ask)
- Provides team visibility into who's running what (bonus feature)

## Primary Use Case: Personal Port Management

Help **one developer** manage **their local machine**:
- "What's running on port 3000?" → Show their local services
- "Kill whatever is on port 3000" → Terminate that process
- "What ports am I using?" → List all their services
- "Start AINative website" → Register and track the service

## Natural Language Commands

When the user asks about ports, use DevManager CLI to help them:

### Check What's On a Port

**User asks**: "What's running on port 3000?"

**You do**:
```bash
cd /Users/aideveloper/core/dev-manager
node bin/cli.js status | grep "Port: 3000" -A 10
```

**Then explain**: Show project name, status, and PID

---

### Kill a Service on a Port

**User asks**: "Kill whatever is on port 3000"

**You do**:
1. First, find the service ID:
```bash
node bin/cli.js status | grep "Port: 3000" -A 10
```

2. Extract the service ID from output

3. Kill it:
```bash
node bin/cli.js kill --service-id <id>
```

**Alternative (quick)**: Use system command:
```bash
lsof -ti :3000 | xargs kill -9
```

---

### Show All My Services

**User asks**: "What ports am I using?" or "Show my running services"

**You do**:
```bash
cd /Users/aideveloper/core/dev-manager
node bin/cli.js status
```

**Then format nicely** with project names, ports, and health status

---

### Register a New Service

**User says**: "I'm starting the AINative website on port 3000"

**You do**:
```bash
cd /Users/aideveloper/core/dev-manager
node bin/cli.js register \
  --project-id "ainative-website-nextjs" \
  --project-name "AINative Website" \
  --port "3000" \
  --command "npm run dev" \
  --health-url "http://localhost:3000"
```

---

## Slash Commands

Create these slash commands in `.claude/commands/`:

### `/check-port <number>`

Check if a specific port is in use:
```bash
cd /Users/aideveloper/core/dev-manager && node bin/cli.js status | grep "Port: {port}"
```

### `/kill-port <number>`

Kill whatever is using a port:
```bash
lsof -ti :{port} | xargs kill -9
```

### `/my-ports`

Show all services I'm running:
```bash
cd /Users/aideveloper/core/dev-manager && node bin/cli.js status
```

### `/team-ports`

Show what the team is running (bonus feature):
```bash
cd /Users/aideveloper/core/dev-manager && node bin/cli.js team
```

---

## DevManager CLI Reference

### Commands Available

| Command | Purpose | Example |
|---------|---------|---------|
| `status` | Show my running services | `node bin/cli.js status` |
| `team` | Show team's services | `node bin/cli.js team` |
| `register` | Register new service | `node bin/cli.js register --port 3000 --project-id myapp` |
| `kill` | Stop a service | `node bin/cli.js kill --service-id abc-123` |
| `cleanup` | Remove stopped services | `node bin/cli.js cleanup --hours 24` |

### Common Scenarios

#### Scenario 1: Port Already In Use

**User**: "I'm getting 'port 3000 already in use'"

**You**:
1. Check what's using it: `node bin/cli.js status | grep 3000`
2. Ask: "Do you want to kill [Project Name]?"
3. If yes: `lsof -ti :3000 | xargs kill -9`
4. Verify: `node bin/cli.js status` (should be gone)

#### Scenario 2: Starting Multiple Projects

**User**: "I want to start AINative Website and Northbound Agency"

**You**:
1. Check current ports: `node bin/cli.js status`
2. Suggest: "AINative on 3000, Northbound on 3001?"
3. If port conflict: Offer to kill or reassign
4. Register both services with DevManager

#### Scenario 3: Cleanup Old Services

**User**: "My port list is cluttered"

**You**:
```bash
cd /Users/aideveloper/core/dev-manager
node bin/cli.js cleanup --hours 24
```

---

## How It Works (Technical)

### 1. Service Registration

When a project starts:
```bash
# start-local.sh calls DevManager
node /Users/aideveloper/core/dev-manager/bin/cli.js register \
  --project-id "my-app" \
  --port "3000" \
  --command "npm run dev"
```

DevManager stores in ZeroDB:
```json
{
  "id": "uuid-here",
  "row_id": "zerodb-row-id",
  "project_name": "My App",
  "port": 3000,
  "pid": 12345,
  "status": "running",
  "user": "you@ainative.studio",
  "hostname": "Your-MacBook.local"
}
```

### 2. Conflict Detection

Before starting, DevManager checks:
1. Is port allocated in ZeroDB?
2. Is process actually running locally?
3. Who owns it?

### 3. Conflict Resolution

Based on `PORT_CONFLICT_MODE` in `.env`:

- **`kill`**: Auto-kill conflicting service
- **`reassign`**: Auto-assign to next available port
- **`ask`**: Prompt user for choice
- **`error`**: Fail immediately

---

## Configuration

DevManager reads from `/Users/aideveloper/core/.env`:

```bash
# ZeroDB API Configuration
ZERODB_API_TOKEN=your-token-here
USER_EMAIL=you@ainative.studio
ZERODB_API_URL=https://ainative-browser-builder.up.railway.app
ZERODB_PROJECT_ID=84236752-47e5-4e73-8371-9eb018a6fe82

# Port conflict resolution: kill | reassign | error | ask
PORT_CONFLICT_MODE=kill
```

---

## Integration with Projects

### Automatic (via start-local.sh)

Projects can integrate DevManager automatically:

```bash
#!/bin/bash
# start-local.sh

# Register with DevManager
node /Users/aideveloper/core/dev-manager/bin/cli.js register \
  --project-id "$(basename "$PWD")" \
  --port "${PORT:-3000}" \
  --command "npm run dev" \
  --health-url "http://localhost:${PORT:-3000}"

# Start the app
npm run dev
```

### Manual (via Claude)

User asks Claude to start their app, Claude:
1. Checks for port conflicts
2. Registers service with DevManager
3. Starts the app
4. Monitors health

---

## Troubleshooting

### "Port already in use" error

```bash
# Quick fix
lsof -ti :3000 | xargs kill -9

# Then verify
node bin/cli.js status
```

### DevManager says service is running but it's not

```bash
# Cleanup stale entries
cd /Users/aideveloper/core/dev-manager
node bin/cli.js cleanup --hours 1
```

### Can't find DevManager CLI

```bash
# Ensure it's built
cd /Users/aideveloper/core/dev-manager
npm run build

# Verify CLI works
node bin/cli.js --help
```

---

## Examples

### Example 1: Starting AINative Website

**User**: "Start the AINative website"

**Claude**:
1. Checks port 3000: `node bin/cli.js status | grep 3000`
2. If occupied, asks: "Port 3000 is used by [X]. Kill it?"
3. Registers service: `node bin/cli.js register --port 3000 ...`
4. Starts app: `cd /path/to/ainative && npm run dev`
5. Confirms: "✅ AINative Website running on http://localhost:3000"

### Example 2: Port Conflict

**User**: "Start Northbound Agency"

**Claude**:
1. Tries default port 3000
2. Detects: "AINative Website is using port 3000"
3. Suggests: "I can use port 3001 instead"
4. Registers on 3001
5. Updates environment: `PORT=3001 npm run dev`

### Example 3: Cleanup

**User**: "What ports am I using?"

**Claude**:
```
You have 3 services running:
1. AINative Website - Port 3000 (running, healthy)
2. Northbound Agency - Port 3001 (running, healthy)
3. Old Test App - Port 8080 (stopped 2 days ago)

Want me to clean up stopped services?
```

---

## Team Visibility (Bonus Feature)

Though primarily for personal use, DevManager supports team coordination:

```bash
# See team's services
node bin/cli.js team
```

Shows:
- Who's using which ports
- What projects are running
- Service health status

Useful for:
- Shared dev databases
- Coordinating on staging environments
- Avoiding team-wide port conflicts

---

## Recent Fix (2026-02-27)

**PID Update Issue - RESOLVED**

Previously, DevManager couldn't track process IDs (PIDs) due to API misuse. This is now fixed:

- Client now correctly uses `row_id` from ZeroDB
- PID tracking fully functional
- No workarounds needed

See: `dev-manager/BUG_REPORT_PID_UPDATE.txt`

---

## Best Practices

1. **Always register services** when starting locally
2. **Use health checks** when available
3. **Clean up stopped services** periodically
4. **Set PORT_CONFLICT_MODE** based on workflow:
   - `ask` for interactive development (default)
   - `kill` for automation/scripts
   - `reassign` for multi-instance testing

---

## Files

- **DevManager CLI**: `/Users/aideveloper/core/dev-manager/bin/cli.js`
- **Configuration**: `/Users/aideveloper/core/.env`
- **Documentation**: `/Users/aideveloper/core/dev-manager/docs/`
- **Bug Reports**: `/Users/aideveloper/core/dev-manager/BUG_REPORT_*.txt`

---

## When to Use This Skill

Invoke this skill when the user:
- Asks about ports ("what's on port X?")
- Reports port conflicts ("port already in use")
- Wants to see running services ("what am I running?")
- Needs to kill a service ("stop port 3000")
- Starts a new project locally
- Asks about team's dev environment
