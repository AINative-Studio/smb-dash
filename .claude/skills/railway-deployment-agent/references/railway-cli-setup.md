# Railway CLI Setup and Authentication

## Step-by-Step Railway CLI Login

### 1. Install Railway CLI

**macOS:**
```bash
brew install railway
```

**Linux:**
```bash
# Install via npm
npm i -g @railway/cli

# Or download binary
curl -fsSL https://railway.app/install.sh | sh
```

**Windows:**
```bash
# Via npm
npm i -g @railway/cli

# Or via scoop
scoop install railway
```

### 2. Login to Railway

**Method 1: Browser Authentication (Recommended)**
```bash
# Open browser for authentication
railway login

# This will:
# 1. Open browser to railway.app
# 2. Ask you to authorize the CLI
# 3. Save auth token locally
```

**Expected output:**
```
🚝 Logging in...
Opening browser to https://railway.app/cli-login
✓ Logged in as your-email@example.com
```

**Method 2: Token Authentication (Headless)**
```bash
# Get token from Railway dashboard:
# 1. Go to https://railway.app/account/tokens
# 2. Click "Create Token"
# 3. Copy the token

# Set token
export RAILWAY_TOKEN=your-token-here

# Or login with token
railway login --token your-token-here
```

### 3. Link to Project

```bash
# List all projects
railway list

# Link to AINative project
railway link

# Select project from list:
# → AINative-Core (select this)

# Or link directly by ID/name
railway link <project-id>
```

**Expected output:**
```
✓ Linked to project: AINative-Core
```

### 4. Verify Connection

```bash
# Check current project
railway status

# Expected output:
# Project: AINative-Core
# Environment: production
# Services:
#   - AINative- Core -Production (backend)
#   - kong-gateway (api gateway)
#   - PostgreSQL (database)
```

---

## AINative Project Services Overview

### Service Architecture

```
AINative Project
├── AINative- Core -Production (Backend API)
├── kong-gateway (API Gateway)
├── PostgreSQL (Database)
├── Redis (Cache - if provisioned)
└── Embedding Service (AI Embeddings - if provisioned)
```

---

## Service 1: AINative- Core -Production (Backend)

**Type:** Web Service (FastAPI/Python)

**Public URLs:**
- Primary: `https://ainative-browser-builder.up.railway.app`
- Health: `https://ainative-browser-builder.up.railway.app/health`
- API Docs: `https://ainative-browser-builder.up.railway.app/api/v1/docs`

**Internal URLs:**
- Railway Private Network: `cody.railway.internal:8080` (NOT accessible from Kong)
- Container Port: 8080 (HTTP)

**Environment Variables:**
- `PORT` - 8080 (auto-set by Railway)
- `DATABASE_URL` - Connection string to PostgreSQL (auto-set)
- `SECRET_KEY` - JWT signing key (manual)
- `BACKEND_CORS_ORIGINS` - Allowed origins (manual)
- `LOG_LEVEL` - Logging level (default: INFO)
- `REDIS_URL` - Redis connection (if using cache)

**Build Configuration:**
- Builder: Dockerfile
- Dockerfile: `src/backend/Dockerfile`
- Root Directory: `/`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health Check: `/health`

**Deployment:**
- Auto-deploys on push to `main` branch
- Build time: ~1-2 minutes (with cache)
- Startup time: ~15-30 seconds
- Health check timeout: 300 seconds

**Resources:**
- Memory: 512MB - 1GB (Railway scales automatically)
- CPU: Shared (scales based on usage)

**CLI Commands:**
```bash
# View logs
railway logs --service "AINative- Core -Production"

# Follow logs
railway logs --service "AINative- Core -Production" --follow

# Check status
railway status --service "AINative- Core -Production"

# Restart service
railway restart --service "AINative- Core -Production"

# View environment variables
railway variables --service "AINative- Core -Production"

# Set environment variable
railway variables set SECRET_KEY=new-value --service "AINative- Core -Production"
```

---

## Service 2: kong-gateway (API Gateway)

**Type:** Web Service (Kong Gateway)

**Public URLs:**
- Primary: `https://kong-gateway-production-8c94.up.railway.app:8000`
- Custom Domain: `https://api.ainative.studio:8000`
- Health: `https://api.ainative.studio:8000/health` (proxied to backend)

**Internal URLs:**
- Railway Private Network: `kong-gateway.railway.internal`
- Proxy Port: 8000
- Admin Port: 8001 (NOT exposed - security)

**Upstream Configuration:**
- Backend URL: `https://ainative-browser-builder.up.railway.app:443`
- Protocol: HTTPS
- Host: `ainative-browser-builder.up.railway.app`
- Port: 443

**CRITICAL: Kong CANNOT access Railway private network DNS**
- ❌ DO NOT USE: `cody.railway.internal`, `cody:8080`
- ✅ ONLY USE: `https://ainative-browser-builder.up.railway.app`

**Configuration:**
- Config File: `kong/config/kong.yml`
- Root Directory: `/kong`
- Config Mode: Declarative (DB-less)

**Routes:**
- All `/health` → Backend health endpoint
- All `/api/v1/*` → Backend API endpoints
- All other paths → Backend

**Plugins:**
- CORS: Enabled for cross-origin requests
- Rate Limiting: Configured per route
- Request/Response Logging: Enabled

**CLI Commands:**
```bash
# View logs
railway logs --service kong-gateway

# Check status
railway status --service kong-gateway

# Restart Kong
railway restart --service kong-gateway

# Test Kong health
curl -I https://api.ainative.studio/health
```

**Kong Headers (for verification):**
```
via: 1.1 kong/3.8.0
x-kong-proxy-latency: <ms>
x-kong-upstream-latency: <ms>
x-kong-request-id: <uuid>
```

---

## Service 3: PostgreSQL (Database)

**Type:** PostgreSQL Database (Railway Plugin)

**Connection Details:**
- Host: `<random>.proxy.rlwy.net`
- Port: 6432 (PgBouncer) - NOT 5432
- Database: `railway`
- User: `postgres`
- Connection String: Auto-set in `DATABASE_URL`

**CRITICAL: Always use port 6432 (PgBouncer)**
- ✅ Correct: `postgresql://user:pass@host:6432/db`
- ❌ Wrong: `postgresql://user:pass@host:5432/db`

**Connection Pool:**
- Max Connections: 100 (platform limit)
- Recommended Pool Size: 10 base + 10 overflow = 20 per service
- Connection Timeout: 30 seconds
- Idle Timeout: 1800 seconds (30 minutes)

**Environment Variables:**
- `DATABASE_URL` - Full connection string (auto-set)
- `PGHOST` - Database host (auto-set)
- `PGPORT` - Database port (auto-set, should be 6432)
- `PGDATABASE` - Database name (auto-set)
- `PGUSER` - Database user (auto-set)
- `PGPASSWORD` - Database password (auto-set)

**CLI Commands:**
```bash
# Connect to database
railway run psql $DATABASE_URL

# Or using Railway CLI
railway connect PostgreSQL

# List tables
railway run psql $DATABASE_URL -c "\dt"

# Describe table
railway run psql $DATABASE_URL -c "\d table_name"

# Run query
railway run psql $DATABASE_URL -c "SELECT * FROM users LIMIT 10;"

# Backup database
railway run pg_dump $DATABASE_URL > backup.sql

# Restore database
railway run psql $DATABASE_URL < backup.sql
```

**Schema Management:**
- Migration Tool: `scripts/sync-production-schema.py` (idempotent)
- ❌ DO NOT USE: `alembic upgrade head` (not idempotent)
- Auto-runs on deployment via Railway start command

---

## Service 4: Redis (Cache) - Optional

**Type:** Redis Database (if provisioned)

**Connection Details:**
- Host: `<random>.proxy.rlwy.net`
- Port: 6379
- Connection String: Auto-set in `REDIS_URL`

**Use Cases:**
- Session storage
- API response caching
- Rate limiting state
- Background job queue

**CLI Commands:**
```bash
# Connect to Redis
railway run redis-cli -u $REDIS_URL

# Ping Redis
railway run redis-cli -u $REDIS_URL ping

# Get all keys
railway run redis-cli -u $REDIS_URL keys '*'

# Flush all keys (DANGER!)
railway run redis-cli -u $REDIS_URL flushall
```

---

## Service 5: Embedding Service - Optional

**Type:** HuggingFace Embeddings Service

**Public URL:**
- `https://embedding-service.up.railway.app` (if deployed)

**Environment Variables:**
- `EMBEDDING_SERVICE_URL` - Set in backend to enable semantic search

**Purpose:**
- Generate vector embeddings for semantic search
- Used by ZeroDB memory and vector search features

---

## Force Push Deployment

### Method 1: Redeploy via CLI (Recommended)

```bash
# Redeploy latest commit
railway redeploy --service "AINative- Core -Production"

# Redeploy specific deployment
railway redeploy --service "AINative- Core -Production" <deployment-id>
```

### Method 2: Force Push via Git

```bash
# Force rebuild without new commits
git commit --allow-empty -m "[DEPLOY] Force rebuild - Refs #<issue>"
git push origin main
```

### Method 3: Trigger via Railway Dashboard

```
1. Go to https://railway.app
2. Select "AINative-Core" project
3. Select "AINative- Core -Production" service
4. Go to "Deployments" tab
5. Click "Redeploy" on latest deployment
```

### Method 4: Rollback to Previous Deployment

```bash
# List recent deployments
railway deployments --service "AINative- Core -Production"

# Redeploy specific deployment
railway redeploy --service "AINative- Core -Production" <deployment-id>
```

---

## Quick Navigation Commands

### View All Services

```bash
# List all services in project
railway status

# Output shows:
# - Service name
# - Status (running/stopped/deploying)
# - Latest deployment
# - Public URLs
```

### Switch Between Services

```bash
# Set default service
railway service

# Select from list:
# → AINative- Core -Production
# → kong-gateway
# → PostgreSQL

# Now all commands use selected service
railway logs  # Logs for selected service
railway status  # Status for selected service
```

### Quick Health Checks

```bash
# Backend health
curl -s https://ainative-browser-builder.up.railway.app/health | jq .

# Kong health
curl -I https://api.ainative.studio/health | grep -E "(HTTP|via)"

# Database health
railway run psql $DATABASE_URL -c "SELECT 1;"

# Redis health (if provisioned)
railway run redis-cli -u $REDIS_URL ping
```

### Environment Variable Management

```bash
# View all variables for service
railway variables --service "AINative- Core -Production"

# Set variable
railway variables set KEY=value --service "AINative- Core -Production"

# Delete variable
railway variables delete KEY --service "AINative- Core -Production"

# Copy variables from one environment to another
railway variables --json > vars.json
railway link <different-environment>
cat vars.json | railway variables set
```

---

## Intelligent Navigation Tips

### 1. Use Service Aliases

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Railway service aliases
alias rlbe='railway logs --service "AINative- Core -Production"'
alias rlkg='railway logs --service kong-gateway'
alias rsbe='railway status --service "AINative- Core -Production"'
alias rskg='railway status --service kong-gateway'
alias rrbe='railway restart --service "AINative- Core -Production"'
alias rrkg='railway restart --service kong-gateway'
```

### 2. Quick Service Selection

```bash
# Create function for fast service selection
railway-select() {
    case $1 in
        be|backend)
            railway service "AINative- Core -Production"
            ;;
        kg|kong|gateway)
            railway service kong-gateway
            ;;
        db|postgres)
            railway service PostgreSQL
            ;;
        redis)
            railway service Redis
            ;;
        *)
            echo "Usage: railway-select [be|kg|db|redis]"
            ;;
    esac
}

# Usage
railway-select be  # Select backend
railway logs       # Now shows backend logs
```

### 3. Monitor All Services

```bash
# Create tmux/screen session with multiple panes
# Pane 1: Backend logs
railway logs --service "AINative- Core -Production" --follow

# Pane 2: Kong logs
railway logs --service kong-gateway --follow

# Pane 3: Status monitoring
watch -n 5 'railway status'
```

---

## Troubleshooting Service Issues

### Backend Not Responding

```bash
# Check status
railway status --service "AINative- Core -Production"

# Check recent logs
railway logs --service "AINative- Core -Production" | tail -100

# Check health endpoint
curl https://ainative-browser-builder.up.railway.app/health

# Restart service
railway restart --service "AINative- Core -Production"
```

### Kong Gateway Issues

```bash
# Check Kong status
railway status --service kong-gateway

# Check Kong logs
railway logs --service kong-gateway | tail -100

# Verify Kong config
cat kong/config/kong.yml | grep -A5 "url:"

# Test Kong health
curl -I https://api.ainative.studio/health
```

### Database Connection Issues

```bash
# Check database status
railway status --service PostgreSQL

# Test connection
railway run psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool
python3 scripts/check_db_connection_pool.py

# Verify DATABASE_URL
echo $DATABASE_URL | grep "6432"  # Should show port 6432
```

---

## Railway Project Limits

**Free Tier:**
- $5 worth of usage per month
- Limited to 500 execution hours
- Shared resources

**Pro Tier:**
- Pay-as-you-go
- No execution hour limits
- Dedicated resources
- Priority support

**Current Usage:**
```bash
# View usage
railway usage

# Shows:
# - Compute hours used
# - Bandwidth used
# - Current month cost
```

---

## Security Best Practices

1. **Never commit Railway tokens**
   ```bash
   # Add to .gitignore
   echo ".railway/" >> .gitignore
   echo "railway-token.txt" >> .gitignore
   ```

2. **Use environment variables for secrets**
   ```bash
   railway variables set SECRET_KEY=$(openssl rand -hex 32)
   ```

3. **Rotate tokens regularly**
   ```bash
   # Go to: https://railway.app/account/tokens
   # Delete old tokens
   # Create new token
   railway login --token <new-token>
   ```

4. **Limit token scope**
   - Use project-specific tokens when possible
   - Don't share tokens across environments

5. **Enable 2FA**
   - Go to: https://railway.app/account/security
   - Enable two-factor authentication
