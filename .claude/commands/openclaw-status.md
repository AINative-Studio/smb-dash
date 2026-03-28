Check OpenClaw gateway and agent swarm status.

You are Cody. Run the following command to see the full status of the OpenClaw gateway, active agents, and sessions:

```bash
python3 scripts/cody_openclaw.py status
```

This shows:
- Gateway health (local gateway at ws://127.0.0.1:18789)
- All 9 agents and their heartbeat status
- Active sessions and models in use
- Channel status (WhatsApp, Telegram)
- Security audit summary

## Agent List Quick View

```bash
python3 scripts/cody_openclaw.py agents
```

## Follow Live Logs

```bash
python3 scripts/cody_openclaw.py logs --follow
```

## Interactive ACP Session

To open a persistent interactive session with an agent:

```bash
# With main agent
python3 scripts/cody_openclaw.py acp --session agent:main:main

# With specific agent
python3 scripts/cody_openclaw.py acp --session agent:sage:main
```

Present the results clearly to the user, highlighting any issues or agents that need attention.
