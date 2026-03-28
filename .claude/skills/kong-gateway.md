# Kong API Gateway — Operations Skill

## Architecture Overview

Kong runs in **DB-less (declarative) mode** on Railway. Configuration lives in `kong/config/kong.yml`.

### Services
| Service | Railway Name | URL |
|---------|-------------|-----|
| Kong Gateway | `kong-gateway` | `api.ainative.studio` (port 8000) |
| Backend | `AINative- Core -Production` | `ainative-browser-builder.up.railway.app` |

### Critical Rule
**Kong CANNOT access Railway private network DNS.** Always use the public backend URL:
- CORRECT: `https://ainative-browser-builder.up.railway.app:443`
- WRONG: `cody.railway.internal:8080` (will fail)

## Configuration

### Config File Location
- **Repo**: `kong/config/kong.yml`
- **Container**: `/kong/config/kong.yml`
- **Railway env**: `KONG_DECLARATIVE_CONFIG=/kong/config/kong.yml`
- **Mode**: `KONG_DATABASE=off` (DB-less, declarative only)

### Key Settings
- Service path: `/api` (prepended to all routed requests)
- Routes with `strip_path: false` send full path to backend
- Routes with `strip_path: true` strip the matched path prefix

### Plugins Active
- `rate-limiting`: 1000/min, 10000/hour, 50000/day
- `cors`: Allow all origins with credentials
- `prometheus`: Metrics collection
- `correlation-id`: Request tracking headers
- `request-size-limiting`: 50MB max request body

### Plugins Disabled (with reason)
- `http-log`: **DISABLED** — was sending to `/api/v1/admin/track-request` which doesn't exist. Created a 404 retry storm that exhausted the connection pool, causing 503 on ALL requests. Re-enable only after implementing the endpoint.

## Troubleshooting

### 503 Service Unavailable
**Most common cause**: A plugin (like http-log) is creating a retry loop that exhausts Kong's connection pool.

**Diagnosis**:
```bash
# 1. Check if backend is up (bypass Kong)
curl https://ainative-browser-builder.up.railway.app/health

# 2. Check Kong logs for retry loops
railway logs --service "kong-gateway" | grep "404\|retry\|error\|max_retry_time"

# 3. If you see http-log 404 spam → disable the plugin in kong.yml
```

**Fix**: Disable the offending plugin in `kong/config/kong.yml`, commit, push, then:
```bash
# Force fresh deploy (env var change triggers rebuild)
railway variables --set "KONG_CONFIG_VERSION=$(date +%Y%m%d%H%M)" --service "kong-gateway"
```

### 404 No Route Matched
Kong config not loaded. Redeploy:
```bash
railway redeploy --service "kong-gateway" -y
```

### 502 Bad Gateway
Backend is down. Check:
```bash
curl https://ainative-browser-builder.up.railway.app/health
railway logs --service "AINative- Core -Production" | tail -50
```

## Deployment

### How to deploy Kong config changes
1. Edit `kong/config/kong.yml`
2. Commit and push to `main`
3. Force redeploy (env var change is most reliable):
```bash
railway variables --set "KONG_CONFIG_VERSION=$(date +%Y%m%d%H%M)" --service "kong-gateway"
```

### Important: Simple redeploy may use cached build
`railway redeploy` may reuse the old container. Setting an env var forces a fresh build that picks up the new kong.yml.

## Scripts
- `scripts/configure_kong_from_backend.py` — Admin API config (for non-DB-less mode)
- `scripts/configure_kong.sh` — Shell-based Kong config
- `scripts/test_kong_routes.sh` — Route verification

## Request Tracking & Billing

Kong tracks all API requests via the http-log plugin for usage billing.

### How it works
1. Every request through Kong triggers http-log plugin
2. Plugin POSTs Kong's log JSON to `/api/v1/internal/track-request-kong`
3. Backend processes in background: parse → calculate credits → write to DB
4. Tables: `mcp_request_logs`, `credit_transactions`, `kong_usage_metrics`

### Credit calculation
- Base: GET=0.1, POST=0.5, PUT=0.3, DELETE=0.2
- Multipliers: AI/LLM=5x, ZeroDB=2x, Memory=1.5x, MCP=1.2x

### CRITICAL: URL must be /internal/ NOT /admin/
The endpoint is mounted at `/api/v1/internal/track-request-kong`. Using `/admin/` caused a 503 outage in March 2026.

### Testing tracking
```bash
# Verify endpoint exists
curl https://ainative-browser-builder.up.railway.app/api/v1/internal/track-request/health

# Send test tracking data
curl -X POST https://ainative-browser-builder.up.railway.app/api/v1/internal/track-request-kong \
  -H "Content-Type: application/json" \
  -d '{"request":{"uri":"/test","method":"GET"},"response":{"status":200},"latencies":{"request":50},"client_ip":"1.2.3.4"}'
```

## Files
- Kong config: `kong/config/kong.yml`
- Request tracking: `src/backend/app/api/internal/request_tracking.py`
- Billing integration docs: `docs/integration/KONG_BILLING_INTEGRATION.md`
- API endpoints reference: `docs/api/API_ENDPOINTS_REFERENCE.md`
- Troubleshooting: `docs/deployment/RAILWAY_TROUBLESHOOTING.md`
- DB-less guide: `docs/deployment/KONG_DB-LESS_MODE_GUIDE.md`
- Quick fix: `docs/deployment/KONG_QUICK_FIX.md`
