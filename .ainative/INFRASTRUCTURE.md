# AINative Infrastructure Inventory

> Last updated: 2026-03-25
> Use this doc to find Railway service IDs, GitHub repos, and API endpoints fast.

---

## Railway

### Auth
- **Token location:** `~/.railway/config.json` → `user.token`
- **GraphQL API:** `https://backboard.railway.app/graphql/v2`
- **CLI account:** Toby Morning (utventures@gmail.com)

Quick query to list all services:
```bash
TOKEN=$(cat ~/.railway/config.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['user']['token'])")
curl -s -X POST https://backboard.railway.app/graphql/v2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ me { projects { edges { node { id name services { edges { node { id name } } } } } } } }"}'
```

---

### Project: AINative Studio - Production
**Project ID:** `47539617-ae34-4a52-a010-a88d875f347e`

| Service | ID | URL / Notes |
|---------|-----|-------------|
| **AINative- Core -Production** | `(query Railway)` | `https://ainative-browser-builder.up.railway.app` — FastAPI backend, Kong upstream |
| **ainative-website-nextjs** | `410afe5c-7419-408f-91a9-f6b658ea158a` | `https://ainative.studio` — Next.js frontend |
| Kong API Gateway | via Railway | `https://api.ainative.studio:8000` — routes to Core backend |

**DB connection (Core backend):**
- Use **PgBouncer port 6432** (NOT 5432)
- Pool: 20 connections per instance (10 base + 10 overflow)
- Check pool: `python3 scripts/check_db_connection_pool.py`

**Redeploy frontend via GraphQL:**
```bash
TOKEN=$(cat ~/.railway/config.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['user']['token'])")
# Get latest deployment ID first, then:
curl -s -X POST https://backboard.railway.app/graphql/v2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { deploymentRedeploy(id: \"<DEPLOYMENT_ID>\") { id status } }"}'
```

---

### Project: Winning Careers
**Project ID:** `f4642b79-b3e8-4d23-a24d-8c724ffffb32`

| Service | ID | Notes |
|---------|-----|-------|
| Winning-Backend | `807bfeec-78da-402c-8600-2278e9d1fc13` | FastAPI backend |
| Winning-FrontEnd | `20c2b26e-2783-4e5b-b3f0-996773170b92` | Next.js frontend |
| blog.winning.careers | `1ec59972-0bda-47c1-98ce-7777b11ca010` | Blog service |
| AiNative-ZeroDB-PostGres | `6ac95417-cb45-4b07-b29a-a3f2c021c634` | Postgres DB |
| AINative-ZeroDB-Redis-Dedicated | `b749d965-a844-46b8-9a3d-ee17780543a4` | Redis |
| AINative-ZSchedule | `44036645-6ff8-4236-a178-b83c94fa57bf` | Scheduling service |

---

### Project: EnGarde Suite
**Project ID:** `d9c00084-0185-4506-b9b5-3baa2369b813`

| Service | ID | Notes |
|---------|-----|-------|
| Main | `ed8ca28c-0420-48c0-a32e-8bbe0da242e4` | Primary app |
| Main Copy | `24c9bba7-6f14-447e-8ecf-2787b78cdab4` | Staging/copy |
| signup-sync-service | `120c8a7c-b5d3-4d46-97e5-e52ab878441c` | Signup sync |
| EGM Scheduler | `919106f5-0cbc-4814-b5a2-73ef17037e1f` | Scheduler |
| demo-data-cron | `c8a5eed2-97e7-4845-bf41-6bde4f6b85f3` | Demo data cron |
| subs-sync | `4fd14600-8994-472a-9187-2b90101801a0` | Subscription sync |
| capilytics-seo | `2e930434-bd8f-422f-a073-4ba0a2fb1ed8` | SEO service |
| sankore-paidads | `30e3f44d-2d98-47dd-a9dd-e39f01458d33` | Paid ads |
| langflow-server | `4aad927f-864c-41dd-a440-b5d00d305a5d` | LangFlow |
| OgaRiche | `5fe9427c-9674-4a9c-a196-b6be7e014583` | OgaRiche service |
| madan-sara | `848d25dd-6ed1-4e70-8cf5-67fd7de420bf` | Madan Sara |
| En-Garde-FlowDB | `254eacc5-9ea7-4bb3-8460-bff18b8a5d3a` | FlowDB |
| Postgres | `758d51e8-3eb8-4109-9859-6eb989947b56` | Postgres DB |
| MySQL | `177752c8-17c8-4298-a59d-1a0ff40c3232` | MySQL DB |
| Redis | `be5ca53b-ccc3-4c15-bdce-3a97631f9f26` | Redis |

---

### Project: rentguy-1
**Project ID:** `2795f00b-ec95-4c5d-bf79-bbbdce7f2097`

| Service | ID | Notes |
|---------|-----|-------|
| front-end | `8479d268-5024-42d1-b01f-60e106fbed04` | Frontend |
| back-end | `8c6a0b38-ce5a-4f12-a2ce-d6c358670b76` | Backend |
| aware-amazement | `8ede44d9-2651-47b8-9f96-09afa63b5b2b` | — |

---

## GitHub — AINative-Studio Org

### Core / Platform

| Repo | Visibility | URL | Description |
|------|-----------|-----|-------------|
| **core** | Private | https://github.com/AINative-Studio/core | Core APIs — FastAPI backend (this repo) |
| **ainative-website** | Public | https://github.com/AINative-Studio/ainative-website | Production Next.js website → ainative.studio |
| **ainative-zerodb-mcp-server** | Public | https://github.com/AINative-Studio/ainative-zerodb-mcp-server | ZeroDB MCP Server (69 tools) |
| **ainative-zerodb-memory-mcp** | Public | https://github.com/AINative-Studio/ainative-zerodb-memory-mcp | ZeroDB Memory MCP (6 tools, thin) |
| **ainative-strapi-mcp-server** | Public | https://github.com/AINative-Studio/ainative-strapi-mcp-server | Strapi CMS MCP server |
| **openclaw-backend** | Private | https://github.com/AINative-Studio/openclaw-backend | OpenClaw Gateway — DBOS durable workflows |
| **agent-swarm-monitor** | Public | https://github.com/AINative-Studio/agent-swarm-monitor | Real-time agent swarm monitoring UI |

### AI Kit / SDKs

| Repo | Visibility | URL | Description |
|------|-----------|-----|-------------|
| **ai-kit** | Public | https://github.com/AINative-Studio/ai-kit | AI Kit — framework-agnostic SDK (32 packages) |
| **ai-kit-a2ui-core** | Public | https://github.com/AINative-Studio/ai-kit-a2ui-core | A2UI protocol core |
| **ai-kit-showcase** | Public | https://github.com/AINative-Studio/ai-kit-showcase | Interactive AI Kit demo site |
| **AINativeStudio-IDE** | Public | https://github.com/AINative-Studio/AINativeStudio-IDE | Agentic IDE client app |
| **builder-ainative-studio** | Public | https://github.com/AINative-Studio/builder-ainative-studio | React component builder (multi-agent) |
| **AgentFlow** | Private | https://github.com/AINative-Studio/AgentFlow | No-code AI agent workflow builder |

### ZeroDB / Zero Products

| Repo | Visibility | URL | Description |
|------|-----------|-----|-------------|
| **ZeroDB.AINative.Studio** | Private | https://github.com/AINative-Studio/ZeroDB.AINative.Studio | ZeroDB platform frontend |
| **ZeroForms** | Private | https://github.com/AINative-Studio/ZeroForms | PRD — ZeroForms v1.0 |
| **ZeroPipeline** | Private | https://github.com/AINative-Studio/ZeroPipeline | PRD — ZeroPipeline micro CRM |
| **ZeroVoice** | Private | https://github.com/AINative-Studio/ZeroVoice | PRD — ZeroVoice v1.0 |
| **ZeroCommerce** | Private | https://github.com/AINative-Studio/ZeroCommerce | eCommerce API (FastAPI + Postgres + Redis) |
| **ZeroInvoice** | Private | https://github.com/AINative-Studio/ZeroInvoice | Invoice app for freelancers/SMB |

### Client Projects

| Repo | Visibility | URL | Description |
|------|-----------|-----|-------------|
| **wwmaa** | Private | https://github.com/AINative-Studio/wwmaa | World Wide Martial Arts Association |
| **winning-backend** | Private | https://github.com/AINative-Studio/winning-backend | Winning Careers backend |
| **winning-backend-staging** | Private | https://github.com/AINative-Studio/winning-backend-staging | Winning Careers backend staging |
| **ocean-backend** | Private | https://github.com/AINative-Studio/ocean-backend | Ocean Knowledge Workspace — FastAPI + ZeroDB |
| **ocean-frontend** | Private | https://github.com/AINative-Studio/ocean-frontend | Ocean frontend |
| **thegraffhouse** | Private | https://github.com/AINative-Studio/thegraffhouse | TheGraffHouse |
| **thegraffhouse-frontend** | Private | https://github.com/AINative-Studio/thegraffhouse-frontend | TheGraffHouse Next.js frontend |
| **bookshopsc** | Private | https://github.com/AINative-Studio/bookshopsc | Bookshop SC Next.js app |
| **northbound-agency** | Public | https://github.com/AINative-Studio/northbound-agency | NorthBound Agency website |
| **venture.ainative.studio** | Private | https://github.com/AINative-Studio/venture.ainative.studio | AINative Venture Studio site |
| **daylight-insights** | Private | https://github.com/AINative-Studio/daylight-insights | Daylight Computer sentiment dashboard |
| **daylight-rag** | Private | https://github.com/AINative-Studio/daylight-rag | Daylight Computer RAG |
| **dothack-backend** | Public | https://github.com/AINative-Studio/dothack-backend | DotHack backend |
| **service-os** | Private | https://github.com/AINative-Studio/service-os | AI-Native Service Operations Platform |

### Research / Evals

| Repo | Visibility | URL | Description |
|------|-----------|-----|-------------|
| **llmevals-framework** | Public | https://github.com/AINative-Studio/llmevals-framework | LLM evals framework |
| **llmevals-framework-frontend** | Public | https://github.com/AINative-Studio/llmevals-framework-frontend | Evals framework frontend |
| **get-physics-done** | Public | https://github.com/AINative-Studio/get-physics-done | Open-source agentic AI physicist (PSI fork) |
| **Agent-402** | Public | https://github.com/AINative-Studio/Agent-402 | Autonomous Fintech Agent (CrewAI × X402 × ZeroDB) |
| **Agent-Gaunlet-Starter-Kit** | Public | https://github.com/AINative-Studio/Agent-Gaunlet-Starter-Kit | Live Agent Gauntlet starter kit |
| **karsten-claw** | Private | https://github.com/AINative-Studio/karsten-claw | Karsten's OpenClaw agentic team |
| **telemetry-agent** | Public | https://github.com/AINative-Studio/telemetry-agent | Agent status & telemetry |
| **oss-repo-check** | Public | https://github.com/AINative-Studio/oss-repo-check | OSS repo checker with AINative integration |

### Infrastructure / Tooling

| Repo | Visibility | URL | Description |
|------|-----------|-----|-------------|
| **local-model-infra** | Private | https://github.com/AINative-Studio/local-model-infra | CPU-only local model infrastructure |
| **xnet-pilot** | Private | https://github.com/AINative-Studio/xnet-pilot | AI-managed Metro Area Network pilot |
| **devcontext** | Private | https://github.com/AINative-Studio/devcontext | Dev context + agent instructions |
| **blog-sources** | Private | https://github.com/AINative-Studio/blog-sources | Blog drafts → Strapi CMS |

### Forks / External

| Repo | Visibility | URL | Description |
|------|-----------|-----|-------------|
| **NemoSwarm** | Public | https://github.com/AINative-Studio/NemoSwarm | NVIDIA plugin for secure AgentSwarm install |
| **Nemotron** | Public | https://github.com/AINative-Studio/Nemotron | NVIDIA Nemotron developer asset hub (fork) |
| **remotion** | Public | https://github.com/AINative-Studio/remotion | Make videos with React (fork) |
| **docusaurus** | Public | https://github.com/AINative-Studio/docusaurus | Documentation site framework (fork) |
| **kwanzaa** | Public | https://github.com/AINative-Studio/kwanzaa | First Fruits for AI — cultural integrity |

---

## Key API Endpoints

| Endpoint | URL |
|----------|-----|
| REST API | `https://api.ainative.studio` |
| API Docs (Swagger) | `https://api.ainative.studio/docs` |
| Health Check | `https://ainative-browser-builder.up.railway.app/health` |
| ZeroMemory API | `https://api.ainative.studio/api/v1/public/memory/v2/` |
| Pricing Plans | `https://api.ainative.studio/api/v1/public/pricing/plans` |
| Frontend | `https://ainative.studio` |

---

## Local Repo Paths

| Repo | Local Path |
|------|-----------|
| Core backend | `/Users/aideveloper/core` |
| Website (Next.js) | `/Users/aideveloper/core/AINative-website-nextjs` |
| Railway CLI config | `~/.railway/config.json` |

---

## Notes

- **Railway CLI** is linked to the backend ("AINative- Core -Production") from this machine. To deploy the **frontend**, use the GraphQL API directly with the token from `~/.railway/config.json` — the CLI `service` is `null` for the frontend path.
- **Kong CANNOT reach Railway private network DNS** — always use the public URL `https://ainative-browser-builder.up.railway.app` as Kong upstream, never `cody.railway.internal`.
- **Database port**: Always use **6432** (PgBouncer), never 5432 directly.
- The `ainative-website` GitHub repo (formerly `ainative-website-nextjs-staging`) is the production repo — Railway deploys from `main` branch.
