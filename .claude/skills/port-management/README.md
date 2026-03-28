# Port Management Skill - Generic Framework

**A reusable port conflict resolution framework for ANY AINative application.**

## Quick Start

### 1. Copy Skill to Your Project

```bash
# Copy the entire skill directory
cp -r /path/to/port-management .claude/skills/
```

### 2. Create Your Configuration

Create `.claude/port-config.json` in your project root:

```json
{
  "project_name": "MyApp",
  "services": [
    {
      "name": "API",
      "port": 3000,
      "start_command": "npm start",
      "health_check": "http://localhost:{port}/health",
      "can_reassign": true
    }
  ]
}
```

### 3. Use the Generic Startup Script

The skill provides a config-driven startup script that works for ANY app:

```bash
# Interactive mode (prompts for conflicts)
scripts/start-local.sh

# Auto-kill conflicting processes
PORT_CONFLICT_MODE=kill scripts/start-local.sh

# Use alternative ports automatically
PORT_CONFLICT_MODE=reassign scripts/start-local.sh
```

## How It Works

The generic startup script:
1. Reads `.claude/port-config.json`
2. Detects port conflicts for all defined services
3. Resolves conflicts based on mode (ask/kill/reassign/error)
4. Starts services in dependency order
5. Updates environment variables automatically
6. Displays summary with all service URLs

**Zero app-specific code required!**

## Configuration Schema

See `SKILL.md` for complete schema documentation.

### Minimal Example

```json
{
  "project_name": "SimpleAPI",
  "services": [
    {
      "name": "API",
      "port": 8080,
      "start_command": "go run main.go"
    }
  ]
}
```

### Complete Example

```json
{
  "project_name": "FullStack",
  "services": [
    {
      "name": "Database",
      "port": 5432,
      "start_command": "docker run -p {port}:5432 postgres",
      "can_reassign": false,
      "required": true
    },
    {
      "name": "Backend",
      "port": 8000,
      "directory": "./backend",
      "start_command": "python -m uvicorn main:app --port {port}",
      "health_check": "http://localhost:{port}/health",
      "can_reassign": true,
      "depends_on": ["Database"],
      "env_vars": {
        "DATABASE_URL": "postgresql://localhost:{Database_port}/app"
      }
    },
    {
      "name": "Frontend",
      "port": 3000,
      "directory": "./frontend",
      "start_command": "npm run dev",
      "can_reassign": true,
      "depends_on": ["Backend"],
      "env_updates": {
        ".env": {
          "REACT_APP_API_URL": "http://localhost:{Backend_port}"
        }
      }
    }
  ],
  "defaults": {
    "port_conflict_mode": "ask"
  }
}
```

## Examples

See `examples/` directory:
- **simple-api.json** - Single service API
- **full-stack.json** - Database + Backend + Frontend
- **microservices.json** - Multiple independent services
- **openclaw.json** (in project root) - Reference implementation

## Port Conflict Modes

| Mode | Behavior | Best For |
|------|----------|----------|
| `ask` | Prompts user interactively | Development |
| `kill` | Auto-kills conflicting processes | CI/CD |
| `reassign` | Uses alternative ports | Multi-instance testing |
| `error` | Fails on conflicts | Production-like environments |

## Variable Substitution

Use these placeholders in any string field:

- `{port}` - Current service's port
- `{SERVICE_NAME_port}` - Another service's port
- `{project_name}` - Project name from config

Example:

```json
{
  "env_vars": {
    "DATABASE_URL": "postgresql://localhost:{Database_port}/app",
    "API_URL": "http://localhost:{Backend_port}"
  }
}
```

## Service Dependencies

Use `depends_on` to control startup order:

```json
{
  "services": [
    {
      "name": "Database",
      "port": 5432
    },
    {
      "name": "Backend",
      "port": 8000,
      "depends_on": ["Database"]
    },
    {
      "name": "Frontend",
      "port": 3000,
      "depends_on": ["Backend"]
    }
  ]
}
```

Services start in order: Database → Backend → Frontend

## Advanced Features

### Pre-Start Commands

```json
{
  "name": "Backend",
  "pre_start": "npm install && npm run build",
  "start_command": "npm start"
}
```

### Optional Services

```json
{
  "name": "Analytics",
  "port": 9000,
  "required": false,
  "skip_if_missing": true
}
```

### Environment File Updates

```json
{
  "name": "Frontend",
  "env_updates": {
    ".env.local": {
      "API_URL": "http://localhost:{Backend_port}"
    },
    ".env.production": {
      "API_URL": "https://api.production.com"
    }
  }
}
```

### Post-Start Checks

```json
{
  "name": "Backend",
  "post_start_checks": [
    {
      "description": "Database migration",
      "log_pattern": "Migration complete",
      "display": "✅ Database ready"
    }
  ]
}
```

## Integration Patterns

### With Docker Compose

```json
{
  "name": "Services",
  "port": 8000,
  "start_command": "docker-compose up",
  "health_check": "http://localhost:{port}/health",
  "pre_start": "docker-compose pull"
}
```

### With Multiple Environments

```json
{
  "services": [
    {
      "name": "DevAPI",
      "port": 8000,
      "start_command": "npm run dev"
    },
    {
      "name": "StagingAPI",
      "port": 8001,
      "start_command": "npm run staging",
      "required": false
    }
  ]
}
```

### With Background Services

```json
{
  "name": "Redis",
  "port": 6379,
  "start_command": "redis-server --port {port}",
  "can_reassign": true,
  "required": false
}
```

## Troubleshooting

### "Command not found" Errors

Ensure services are in PATH or use absolute paths:

```json
{
  "start_command": "/usr/local/bin/python3 -m uvicorn ..."
}
```

### Services Not Starting in Order

Check `depends_on` and ensure no circular dependencies:

```bash
# This will fail (circular)
Frontend depends_on Backend
Backend depends_on Frontend
```

### Port Reassignment Not Working

Ensure service supports custom ports:

```json
{
  "can_reassign": true,
  "env_vars": {
    "PORT": "{port}"  // Pass port to service
  }
}
```

## Best Practices

1. ✅ Always test with all 4 conflict modes
2. ✅ Use health checks when available
3. ✅ Set `can_reassign: false` for services that require fixed ports
4. ✅ Use `required: false` for optional services
5. ✅ Document port requirements in project README
6. ✅ Keep pre_start commands fast (< 30 seconds)
7. ✅ Use explicit dependencies rather than startup delays

## Migration Guide

### From Hardcoded Scripts

**Before:**
```bash
#!/bin/bash
cd gateway && npm start &
cd backend && python app.py &
cd frontend && npm run dev &
```

**After:**
1. Create `.claude/port-config.json`
2. Use generic `scripts/start-local.sh`
3. Delete custom startup scripts

### From Docker Compose

Keep using Docker Compose, but wrap it:

```json
{
  "name": "DockerServices",
  "port": 8000,
  "start_command": "docker-compose up",
  "health_check": "http://localhost:{port}/health"
}
```

## Contributing

To add features or examples:
1. Test with at least 3 different app types
2. Add example to `examples/`
3. Update `SKILL.md` documentation
4. Submit PR with test results

## Support

For issues or questions:
- Check `SKILL.md` for complete documentation
- Review `examples/` for reference implementations
- See OpenClaw's `.claude/port-config.json` for production example

## License

Part of AINative's Claude Code skill system.
