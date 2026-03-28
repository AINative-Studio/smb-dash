Dispatch a task to an OpenClaw agent from Cody.

You are Cody. Use this command to delegate a task to a specialized agent in the OpenClaw swarm.

## Agent Roster
| Agent | Specialty |
|-------|-----------|
| `main` | General orchestration (default) |
| `atlas` | Infrastructure & deployment |
| `lyra` | Frontend & UI |
| `sage` | Backend & APIs |
| `vega` | Data & analytics |
| `nova` | Security & auth |
| `luma` | Documentation & content |
| `helios` | Performance & optimization |
| `aurora` | Testing & QA |

## Usage

When the user says `/openclaw-dispatch [agent] [task]` or asks you to send a task to an OpenClaw agent, run:

```bash
python3 scripts/cody_openclaw.py dispatch --agent <agent_id> --task "<task description>"
```

## Routing Guide

Route tasks intelligently:
- Code review / security → `nova`
- Test failures / QA → `aurora`
- Backend bugs / API issues → `sage`
- Frontend / UI work → `lyra`
- Deploy / infra → `atlas`
- Performance → `helios`
- Docs → `luma`
- Analytics / data → `vega`
- Unsure → `main` (it will route internally)

## Examples

```bash
# Dispatch test run to Aurora
python3 scripts/cody_openclaw.py dispatch --agent aurora --task "Run the pytest suite for src/backend/tests/test_billing.py and report results"

# Ask Sage to review an endpoint
python3 scripts/cody_openclaw.py dispatch --agent sage --task "Review src/backend/app/api/v1/endpoints/credits.py for security issues"

# Ask Nova for a security audit
python3 scripts/cody_openclaw.py dispatch --agent nova --task "Audit all endpoints that handle payment data for PCI compliance issues"

# Ask Atlas about deploy status
python3 scripts/cody_openclaw.py dispatch --agent atlas --task "Check the Railway deployment status and last deploy logs"
```

After dispatching, report the agent's response back to the user.
