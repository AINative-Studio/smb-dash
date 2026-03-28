---
name: railway-deployment-agent
description: Complete Railway deployment workflow with zero-error validation, auto-triggered git hooks, and fast deployment optimization. Use when deploying to Railway production, debugging deployment failures, or setting up CI/CD for Railway platform.
---

# Railway Deployment Agent - Zero-Error Fast Deployment Guide

## Quick Reference

| Item | Value |
|------|-------|
| **Backend URL** | `ainative-browser-builder.up.railway.app` |
| **API Gateway** | `api.ainative.studio:8000` (Kong) |
| **Database Port** | 6432 (PgBouncer) - NOT 5432 |
| **DB Pool** | 20 connections per instance |
| **Main Branch** | `main` |
| **Auto-Deploy** | Push to `main` triggers Railway |

---

## Pre-Deployment Validation Checklist

**MANDATORY: Run ALL checks before deployment. Zero tolerance for skipping.**

### 1. Issue Tracking (REQUIRED)

```bash
# Verify issue is assigned to you
gh issue view <issue-number> | grep "assignees:"

# If not assigned, assign yourself
gh issue edit <issue-number> --add-assignee $(gh api user --jq '.login')

# Verify branch name follows convention
# Format: [type]/[issue-number]-[slug]
# Types: BUG, FEATURE, TEST, REFACTOR, DOCS, DEVOPS
git branch --show-current
# Expected: feature/1186-railway-deployment or bug/1217-fix-cors
```

### 2. Test Execution (MANDATORY - NO EXCEPTIONS)

```bash
# Backend tests with coverage
cd /Users/aideveloper/core/src/backend
python3 -m pytest tests/ -v --cov=app --cov-report=term-missing

# REQUIRED: Verify output shows:
# ✓ All tests PASSED (no failures, no skips critical tests)
# ✓ Coverage >= 80%
# ✓ No import errors

# Save test output for PR
python3 -m pytest tests/ -v --cov=app --cov-report=term-missing > test_results.txt 2>&1
```

**⚠️ STOP HERE if tests fail or coverage < 80%. Fix issues first.**

### 3. Database Schema Sync Check

```bash
# DRY RUN FIRST (ALWAYS!)
python3 scripts/sync-production-schema.py --dry-run

# Review output:
# ✓ Tables/columns that exist (will be skipped)
# ℹ New tables/columns that would be created
# ⚠ Any potential issues

# If dry-run looks good, continue to deployment
# Actual sync will run automatically on Railway deploy
```

### 4. Database Connection Pool Check

```bash
# Check current pool status
python3 scripts/check_db_connection_pool.py

# CRITICAL: If pool usage > 90%, STOP and fix
# Kill dev servers:
pkill -9 -f "npm run dev"
pkill -9 -f "python.*uvicorn"
sleep 30
python3 scripts/check_db_connection_pool.py  # Verify pool recovered
```

### 5. File Placement Validation

```bash
# Check for file placement violations
# This runs automatically on commit via pre-commit hook
# Manual check:
git diff --cached --name-only | grep -E '^\w+\.md$|^src/backend/\w+\.md$|^src/backend/\w+\.sh$'

# Expected: No output (all files in correct locations)
# If violations found:
#   - .md files (except README.md, CLAUDE.md) → docs/{category}/
#   - .sh scripts → scripts/
```

### 6. Lint and Format Check

```bash
cd /Users/aideveloper/core/src/backend

# Python linting
flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics

# Format check with black
black --check .

# If errors found, fix them:
black .
```

### 7. Security Scan

```bash
# Check for secrets, credentials, PII in code
grep -r "password\s*=\s*['\"]" src/backend/app/ --exclude-dir=tests
grep -r "api_key\s*=\s*['\"]" src/backend/app/ --exclude-dir=tests
grep -r "secret\s*=\s*['\"]" src/backend/app/ --exclude-dir=tests

# Expected: No matches (use environment variables instead)
```

---

## Deployment Workflow

### Step 1: Prepare Commit (No AI Attribution - ZERO TOLERANCE)

```bash
# Stage changes
git add .

# Create commit with CLEAN message (NO AI ATTRIBUTION!)
# ❌ FORBIDDEN: "Claude", "Anthropic", "Generated with", "Co-Authored-By: Claude"
# ✅ CORRECT: Clean, professional description

git commit -m "$(cat <<'EOF'
[TYPE] Brief description - Refs #<issue-number>

- Implementation detail 1
- Implementation detail 2
- Implementation detail 3

Test coverage: X% (pytest output attached in PR)

Refs #<issue-number>
EOF
)"

# Types: [BUG], [FEATURE], [TEST], [REFACTOR], [DOCS], [DEVOPS]
```

**CRITICAL: Verify NO AI attribution before pushing:**

```bash
# Check last commit message
git log -1 --pretty=%B | grep -E "(Claude|Anthropic|Generated with|Co-Authored-By: Claude)"

# Expected: No matches
# If matches found: STOP and amend commit
git commit --amend
# Remove ALL AI attribution text
```

### Step 2: Push to Main (Triggers Railway Auto-Deploy)

```bash
# Push to main branch (triggers Railway deployment)
git push origin main

# Railway will automatically:
# 1. Detect push to main
# 2. Build Docker image from src/backend/Dockerfile
# 3. Run schema sync: python scripts/sync-production-schema.py --apply
# 4. Deploy new container
# 5. Health check at /health endpoint
```

### Step 3: Monitor Deployment

```bash
# Watch Railway logs in real-time
railway logs --service "AINative- Core -Production" --follow

# Look for:
# ✓ "Building..." (Docker build started)
# ✓ "Deploying..." (Container deployment started)
# ✓ "Schema sync completed" (Database updated)
# ✓ "Health check passed" (Service healthy)
# ✗ Any ERROR or CRITICAL logs (investigate immediately)
```

### Step 4: Verify Deployment

```bash
# Test backend health
curl -s https://ainative-browser-builder.up.railway.app/health | jq .

# Expected response:
# {
#   "status": "healthy",
#   "version": "1.0.0",
#   "timestamp": "2026-03-06T...",
#   "environment": "production"
# }

# Test through Kong gateway
curl -I https://api.ainative.studio/health | grep -E "(HTTP|via:|x-kong)"

# Expected:
# HTTP/1.1 200 OK
# via: 1.1 kong/3.8.0
# x-kong-proxy-latency: ...
# x-kong-upstream-latency: ...

# Test API endpoint
curl -X POST https://api.ainative.studio/v1/public/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Expected: HTTP 422 Validation error (not 404 or 500)
```

### Step 5: Create Pull Request

```bash
# Generate PR (if deploying from feature branch)
gh pr create --title "[TYPE] Brief description - Fixes #<issue-number>" --body "$(cat <<'EOF'
## Summary
- What changed
- Why it changed
- Impact of changes

## Test Plan
### Test Command:
```bash
cd src/backend
python3 -m pytest tests/test_feature.py -v --cov=app.module
```

### Test Output:
```
test_feature_1 PASSED                    [ 25%]
test_feature_2 PASSED                    [ 50%]
test_feature_3 PASSED                    [ 75%]
test_feature_4 PASSED                    [100%]
==================== 4 passed in 2.31s ====================
Coverage: 87%
```

## Risk Assessment
- **Risk Level**: Low/Medium/High
- **Rollback Plan**: Revert commit via `git revert <commit-sha>` and redeploy
- **Database Changes**: Yes/No (if yes, schema sync included)

## Verification
- [ ] Tests passing locally (see output above)
- [ ] Tests passing in CI/CD
- [ ] Health check verified
- [ ] Kong gateway verified
- [ ] Database schema synced
- [ ] No secrets/PII in code
- [ ] File placement correct

Fixes #<issue-number>
EOF
)"
```

**⚠️ VERIFY PR DESCRIPTION HAS NO AI ATTRIBUTION BEFORE CREATING**

---

## Fast Deployment Optimization

### 1. Docker Build Cache

Railway automatically caches Docker layers. To maximize cache hits:

```dockerfile
# In Dockerfile, order from least to most frequently changed:
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt  # Cached if requirements unchanged
COPY . .  # Only invalidates if code changes
```

### 2. Parallel Testing

```bash
# Run tests in parallel for faster CI
cd src/backend
pytest tests/ -n auto --dist loadfile
```

### 3. Skip Unnecessary Tests in CI

```yaml
# In .github/workflows/backend-ci.yml
on:
  push:
    branches: [ main ]
    paths:
      - 'src/backend/**'  # Only run if backend files changed
      - '.github/workflows/backend-ci.yml'
```

### 4. Database Connection Pooling

```python
# Already optimized in src/backend/app/db/session.py
# Pool size: 10 base + 10 overflow = 20
# Recycle connections: 1800s (30 min)
# Pre-ping: True (validates connection before use)
```

---

## Zero-Error Debugging Guide

### Error: "DNS resolution failed" (Kong)

**Symptom:** Kong logs show `dns server error: 3 name error`

**Root Cause:** Kong using internal hostname instead of public URL

**Solution:**
```bash
# Verify kong/config/kong.yml has correct upstream
cat kong/config/kong.yml | grep -A5 "url:"

# MUST show: url: https://ainative-browser-builder.up.railway.app
# NOT: cody.railway.internal, cody:8080, api.ainative.studio
```

### Error: "QueuePool limit reached"

**Symptom:** Backend logs show `QueuePool limit of size 3 overflow 5 reached`

**Root Cause:** Too many open database connections

**Solution:**
```bash
# Check pool status
python3 scripts/check_db_connection_pool.py

# If > 90%, kill dev servers
pkill -9 -f "npm run dev"
pkill -9 -f "python.*uvicorn"
sleep 30

# Verify recovery
python3 scripts/check_db_connection_pool.py
```

### Error: 502/503 from Kong

**Symptom:** `curl https://api.ainative.studio/health` returns HTTP 502 or 503

**Diagnosis:**
```bash
# Step 1: Check backend directly
curl -s https://ainative-browser-builder.up.railway.app/health

# If backend fails → backend is down (NOT Kong issue)
railway status --service "AINative- Core -Production"
railway logs --service "AINative- Core -Production" | tail -100

# If backend works → Kong configuration issue
railway logs --service kong-gateway | tail -100
```

### Error: Tests Failing in CI but Passing Locally

**Symptom:** GitHub Actions shows test failures, but local tests pass

**Solution:**
```bash
# Reproduce CI environment locally
cd src/backend

# Use same Python version as CI
python --version  # Should match CI (3.12)

# Use same database as CI
export DATABASE_URL="postgresql://postgres:postgres@localhost/cody_test"

# Run tests exactly as CI does
pytest --cov=app --cov-report=xml --cov-report=term tests/ -v
```

### Error: Schema Sync Fails

**Symptom:** Railway deployment fails with database error

**Solution:**
```bash
# Test schema sync locally first
python3 scripts/sync-production-schema.py --dry-run

# If errors, check for:
# 1. Syntax errors in SQL
# 2. Missing table dependencies
# 3. Constraint violations

# Fix issues and test again
python3 scripts/sync-production-schema.py --dry-run
```

---

## Git Hook Auto-Trigger Setup

### Pre-Commit Hook (Already Installed)

**Location:** `.git/hooks/pre-commit`

**Automatically runs:**
1. File placement validation (blocks commits with misplaced files)
2. No AI attribution check (coming soon)

**To bypass (NOT RECOMMENDED):**
```bash
git commit --no-verify  # Skips pre-commit hook
```

### Pre-Push Hook (Optional - Add Test Gate)

**Create:** `.git/hooks/pre-push`

```bash
#!/bin/bash
# Pre-push hook to run tests before pushing to main

echo "🔍 Running tests before push..."

# Only run on pushes to main
branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != "main" ]; then
    echo "✅ Not pushing to main, skipping tests"
    exit 0
fi

# Run backend tests
cd src/backend
if ! python3 -m pytest tests/ -v --cov=app --cov-report=term-missing; then
    echo "❌ Tests failed! Push blocked."
    echo "Fix tests before pushing to main."
    exit 1
fi

echo "✅ All tests passed! Pushing to main..."
exit 0
```

**Install:**
```bash
chmod +x .git/hooks/pre-push
```

### Post-Merge Hook (Auto Schema Sync - Optional)

**Create:** `.git/hooks/post-merge`

```bash
#!/bin/bash
# Post-merge hook to suggest schema sync after pulling changes

echo "🔍 Checking for schema changes..."

# Check if migration files or models changed
if git diff-tree -r --name-only --no-commit-id HEAD@{1} HEAD | grep -E "(alembic|models)"; then
    echo "⚠️  Database schema may have changed!"
    echo "Run: python3 scripts/sync-production-schema.py --dry-run"
fi
```

**Install:**
```bash
chmod +x .git/hooks/post-merge
```

---

## Integration with Existing Skills

This deployment workflow automatically integrates:

### 1. **mandatory-tdd** Skill
- Enforces test execution before commit
- Requires 80%+ coverage proof
- Blocks deployment if tests fail

### 2. **git-workflow** Skill
- Enforces NO AI attribution (zero tolerance)
- Clean commit messages
- Professional PR descriptions

### 3. **database-schema-sync** Skill
- Auto-runs schema sync on Railway deploy
- Idempotent and safe
- Shows what changes before applying

### 4. **ci-cd-compliance** Skill
- GitHub Actions CI gates
- Auto-deploy to Railway on push to main
- Lint → Test → Build → Deploy sequence

### 5. **delivery-checklist** Skill
- Pre-deployment validation checklist
- PR requirements
- Verification steps

### 6. **file-placement** Skill
- Pre-commit hook validation
- Blocks misplaced documentation
- Enforces docs/ and scripts/ structure

### 7. **story-workflow** Skill
- Issue tracking enforcement
- Branch naming conventions
- Story type and estimate requirements

---

## Railway-Specific Configuration

### Environment Variables (Set in Railway Dashboard)

**Required:**
- `PORT` - Auto-set by Railway
- `DATABASE_URL` - Auto-set when PostgreSQL added
- `SECRET_KEY` - Set manually (JWT signing)
- `BACKEND_CORS_ORIGINS` - Set to allowed origins

**Optional:**
- `LOG_LEVEL` - Default: "INFO"
- `REDIS_URL` - If using Redis caching
- `EMBEDDING_SERVICE_URL` - For semantic search features

### Dockerfile Requirements

**Location:** `src/backend/Dockerfile` or `src/backend/Dockerfile.production`

**Required features:**
- Non-root user
- Health check endpoint
- Port from environment variable
- Fast startup time

### Railway.toml Configuration

**Location:** `railway.toml` (project root)

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "src/backend/Dockerfile"

[deploy]
startCommand = "python scripts/sync-production-schema.py --apply && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

---

## Quick Command Reference

```bash
# Pre-Deployment
python3 -m pytest tests/ -v --cov=app --cov-report=term-missing  # Run tests
python3 scripts/sync-production-schema.py --dry-run              # Check schema
python3 scripts/check_db_connection_pool.py                      # Check DB pool
git log -1 --pretty=%B | grep -i claude                          # Check attribution

# Deployment
git push origin main                                              # Deploy to Railway
railway logs --service "AINative- Core -Production" --follow     # Watch logs
curl -s https://ainative-browser-builder.up.railway.app/health   # Check health

# Verification
curl -I https://api.ainative.studio/health | grep via            # Check Kong
railway status --service "AINative- Core -Production"            # Check status
gh pr create --title "[TYPE] Description - Fixes #123"           # Create PR

# Debugging
railway logs --service "AINative- Core -Production" | tail -100  # Recent logs
python3 scripts/check_db_connection_pool.py                      # Pool status
railway status                                                    # All services
```

---

## Rollback Procedure

### Immediate Rollback (Emergency)

```bash
# Method 1: Revert commit and redeploy
git revert <bad-commit-sha>
git push origin main  # Triggers automatic redeployment

# Method 2: Railway dashboard rollback
# Go to Railway → AINative- Core -Production → Deployments → Select previous → Redeploy
```

### Planned Rollback (Non-Emergency)

```bash
# Create rollback PR
git revert <bad-commit-sha> --no-commit
git commit -m "[ROLLBACK] Revert feature X - Refs #<issue>"
gh pr create --title "[ROLLBACK] Revert feature X - Refs #<issue>"

# Get approval, then merge to trigger deployment
```

---

## Success Metrics

**Deployment is successful when:**

- ✅ All tests pass (no failures, >= 80% coverage)
- ✅ No AI attribution in commits/PRs
- ✅ Schema sync completes without errors
- ✅ Health check returns HTTP 200
- ✅ Kong gateway responds with correct headers
- ✅ Database connection pool < 75% usage
- ✅ No ERROR/CRITICAL logs in Railway
- ✅ All file placements correct
- ✅ Issue properly tracked and linked

**If any item fails: STOP, fix issue, and restart from pre-deployment validation.**

---

## Common Pitfalls to Avoid

1. ❌ Skipping test execution ("tests look good")
2. ❌ Including AI attribution in commits/PRs
3. ❌ Deploying without schema sync dry-run
4. ❌ Pushing with database pool > 90%
5. ❌ Using port 5432 instead of 6432 (PgBouncer)
6. ❌ Kong upstream pointing to internal hostname
7. ❌ Committing secrets or PII in code
8. ❌ Creating .md files in root directories
9. ❌ Not assigning GitHub issue before starting work
10. ❌ Force pushing to main branch

---

## Railway CLI Setup and Navigation

**IMPORTANT: For detailed Railway CLI login and service navigation, see:** `references/railway-cli-setup.md`

### Quick Railway CLI Login

```bash
# Step 1: Install Railway CLI
brew install railway  # macOS
npm i -g @railway/cli  # All platforms

# Step 2: Login
railway login  # Opens browser for authentication

# Step 3: Link to project
railway link  # Select "AINative-Core" from list

# Step 4: Verify
railway status  # Shows all services
```

### AINative Project Services

**Our Railway project contains:**

1. **AINative- Core -Production** (Backend API)
   - URL: `https://ainative-browser-builder.up.railway.app`
   - Port: 8080 (HTTP), 443 (HTTPS)
   - Auto-deploys on push to main

2. **kong-gateway** (API Gateway)
   - URL: `https://api.ainative.studio:8000`
   - Upstream: Backend service (public URL)
   - Proxy port: 8000, Admin port: 8001 (not exposed)

3. **PostgreSQL** (Database)
   - Port: 6432 (PgBouncer) - NOT 5432
   - Max connections: 100
   - Auto-provisioned, connection in `DATABASE_URL`

4. **Redis** (Cache) - Optional
   - Port: 6379
   - Used for session storage, caching

5. **Embedding Service** - Optional
   - HuggingFace embeddings for semantic search

### Fast Service Navigation

```bash
# View all services
railway status

# Select specific service
railway service "AINative- Core -Production"

# Now all commands target selected service
railway logs
railway restart
railway variables
```

### Force Push Deployment

```bash
# Method 1: Redeploy via CLI (recommended)
railway redeploy --service "AINative- Core -Production"

# Method 2: Force rebuild via git
git commit --allow-empty -m "[DEPLOY] Force rebuild"
git push origin main

# Method 3: Rollback to previous
railway deployments --service "AINative- Core -Production"
railway redeploy --service "AINative- Core -Production" <deployment-id>
```

**For complete Railway CLI setup, service details, and intelligent navigation tips:**
See: `references/railway-cli-setup.md`

---

## Related Documentation

- **Railway CLI Setup:** `references/railway-cli-setup.md` (detailed login, services, force deploy)
- **Agent Recovery Guide:** `references/agent-recovery-guide.md` (when things go wrong, how to recover)
- **Stupid Mistakes Prevention:** `references/stupid-mistakes-prevention.md` (top 10 mistakes to avoid)
- **Quick Commands:** `references/quick-commands.md` (command reference)
- **Troubleshooting:** `references/troubleshooting-guide.md` (comprehensive debugging)
- Railway troubleshooting: `docs/deployment/RAILWAY_TROUBLESHOOTING.md`
- Kong deployment: `docs/deployment/KONG_DEPLOYMENT_GUIDE.md`
- Database testing: `docs/database/DATABASE_TESTING_STANDARDS.md`
- API reference: `docs/api/API_REFERENCE.md`
- Quick start: `docs/guides/QUICK_START.md`
