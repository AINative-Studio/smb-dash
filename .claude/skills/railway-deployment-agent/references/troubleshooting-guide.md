# Railway Deployment - Troubleshooting Guide

## Common Deployment Failures

### 1. Pre-Deployment Validation Failures

#### Symptom: Branch Name Invalid
```
❌ Branch name must follow: [type]/[issue-number]-[slug]
   Current: fix-bug
```

**Solution:**
```bash
# Create correctly named branch
git checkout -b bug/1234-fix-cors-issue

# Or rename current branch
git branch -m bug/1234-fix-cors-issue
```

#### Symptom: Issue Not Assigned
```
❌ Issue #1234 is not assigned to you
```

**Solution:**
```bash
# Assign issue to yourself
gh issue edit 1234 --add-assignee @me

# Or via GitHub web UI
```

#### Symptom: AI Attribution Detected
```
❌ AI attribution found in last commit
   FORBIDDEN: Claude, Anthropic, Generated with, Co-Authored-By
```

**Solution:**
```bash
# Amend last commit and remove attribution
git commit --amend

# In editor, remove ALL lines containing:
# - Claude
# - Anthropic
# - Generated with
# - Co-Authored-By: Claude
# - Any AI tool references
```

#### Symptom: Misplaced Files
```
❌ Misplaced files found:
   DEPLOYMENT_GUIDE.md
   deployment.sh
```

**Solution:**
```bash
# Move files to correct locations
git reset HEAD DEPLOYMENT_GUIDE.md deployment.sh
mkdir -p docs/deployment
mv DEPLOYMENT_GUIDE.md docs/deployment/
mv deployment.sh scripts/

# Stage and commit
git add docs/deployment/DEPLOYMENT_GUIDE.md scripts/deployment.sh
git commit -m "[DOCS] Relocate deployment files to correct directories - Refs #1234"
```

---

### 2. Database Issues

#### Symptom: QueuePool Limit Reached
```
QueuePool limit of size 3 overflow 5 reached, connection timed out
```

**Root Cause:** Too many open database connections (dev servers running)

**Solution:**
```bash
# Check current pool status
python3 scripts/check_db_connection_pool.py

# Kill all dev servers
pkill -9 -f "npm run dev"
pkill -9 -f "python.*uvicorn"
pkill -9 -f "node.*vite"

# Wait for connections to close
sleep 30

# Verify pool recovered
python3 scripts/check_db_connection_pool.py
# Should show < 75% usage
```

**Prevention:**
```bash
# Before deployment, always check pool
python3 scripts/check_db_connection_pool.py

# Stop dev servers before deploying
# Add to pre-push hook if needed
```

#### Symptom: Schema Sync Fails
```
ERROR: relation "new_table" already exists
```

**Root Cause:** Schema sync not idempotent or manual SQL ran

**Solution:**
```bash
# Check what exists in database
psql $DATABASE_URL -c "\dt" | grep new_table

# If table exists, check if schema matches
psql $DATABASE_URL -c "\d new_table"

# Update sync script to handle existing table
# Add: IF NOT EXISTS clause

# Test with dry-run
python3 scripts/sync-production-schema.py --dry-run
```

#### Symptom: Connection to Database Failed
```
could not connect to server: Connection refused
```

**Root Cause:** Database service down or wrong connection string

**Solution:**
```bash
# Check Railway database status
railway status

# Verify DATABASE_URL variable
railway variables --service "AINative- Core -Production" | grep DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# If using wrong port (5432 vs 6432)
# Update connection string to use 6432 (PgBouncer)
```

---

### 3. Test Failures

#### Symptom: Tests Pass Locally but Fail in CI
```
FAILED tests/test_auth.py::test_login - AssertionError
```

**Root Cause:** Environment differences between local and CI

**Solution:**
```bash
# Reproduce CI environment
cd src/backend

# Use same Python version
python --version  # Should match CI (3.12)

# Use same database
export DATABASE_URL="postgresql://postgres:postgres@localhost/cody_test"
export TEST_MODE=true

# Run tests exactly as CI does
pytest --cov=app --cov-report=xml tests/ -v

# Check for environment-specific issues:
# - Hardcoded paths
# - Missing environment variables
# - Database state dependencies
```

#### Symptom: ImportError in Tests
```
ImportError: cannot import name 'function_name' from 'app.module'
```

**Root Cause:** Missing dependencies or circular imports

**Solution:**
```bash
# Reinstall dependencies
pip install -r src/backend/requirements.txt

# Check for circular imports
python3 -c "from app.module import function_name"

# If circular import, refactor code structure
```

#### Symptom: Coverage Below 80%
```
FAILED: Coverage threshold not met (75% < 80%)
```

**Root Cause:** Missing test cases

**Solution:**
```bash
# Generate coverage report with missing lines
cd src/backend
pytest tests/ --cov=app --cov-report=html

# Open htmlcov/index.html in browser
# Identify untested lines (shown in red)

# Write tests for missing coverage
```

---

### 4. Kong Gateway Issues

#### Symptom: 502 Bad Gateway
```
HTTP/1.1 502 Bad Gateway
via: 1.1 kong/3.8.0
```

**Root Cause:** Backend service down or Kong can't reach it

**Solution:**
```bash
# Step 1: Check backend directly
curl -s https://ainative-browser-builder.up.railway.app/health

# If backend fails → backend is down
railway status --service "AINative- Core -Production"
railway logs --service "AINative- Core -Production" | tail -100

# If backend works → Kong issue
# Step 2: Check Kong logs
railway logs --service kong-gateway | tail -100

# Step 3: Verify Kong upstream URL
cat kong/config/kong.yml | grep -A5 "url:"
# MUST be: https://ainative-browser-builder.up.railway.app
```

#### Symptom: DNS Resolution Failed
```
dns resolution failed: dns server error: 3 name error
```

**Root Cause:** Kong trying to use internal hostname

**Solution:**
```bash
# Check Kong config
cat kong/config/kong.yml | grep "host:"

# WRONG (will fail):
# - cody.railway.internal
# - cody:8080
# - api.ainative.studio

# CORRECT:
# - ainative-browser-builder.up.railway.app

# Update kong/config/kong.yml:
url: https://ainative-browser-builder.up.railway.app
protocol: https
host: ainative-browser-builder.up.railway.app
port: 443

# Commit and redeploy Kong
git add kong/config/kong.yml
git commit -m "[FIX] Update Kong upstream to public URL - Refs #734"
git push origin main
```

#### Symptom: 404 Not Found (All Endpoints)
```
HTTP/1.1 404 Not Found
{"message":"no Route matched with those values"}
```

**Root Cause:** Kong routes not loaded

**Solution:**
```bash
# Check if Kong is running
railway status --service kong-gateway

# Check Kong logs for config loading
railway logs --service kong-gateway | grep -i "declarative"

# Expected: "declarative config is valid"

# If config invalid, check kong.yml syntax
yamllint kong/config/kong.yml

# Redeploy Kong
railway redeploy --service kong-gateway
```

---

### 5. Build Failures

#### Symptom: Docker Build Failed
```
ERROR: failed to solve: failed to compute cache key
```

**Root Cause:** Missing files referenced in Dockerfile

**Solution:**
```bash
# Check Dockerfile for missing files
cat src/backend/Dockerfile

# Common issues:
# - COPY command references non-existent file
# - requirements.txt missing
# - .dockerignore excluding needed files

# Test build locally
cd src/backend
docker build -f Dockerfile -t test-build .
```

#### Symptom: Dependency Installation Failed
```
ERROR: Could not find a version that satisfies the requirement package==1.2.3
```

**Root Cause:** Package version not available or typo

**Solution:**
```bash
# Check package name and version
pip search package_name

# Update requirements.txt with correct version
# Or remove version constraint:
package  # Instead of: package==1.2.3

# Test locally
pip install -r src/backend/requirements.txt
```

---

### 6. Runtime Errors

#### Symptom: Application Won't Start
```
ERROR: Failed to start application
Address already in use
```

**Root Cause:** Port conflict or previous instance still running

**Solution:**
```bash
# In Railway, this shouldn't happen (isolated containers)
# If testing locally:

# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>

# Or use different port
export PORT=8081
```

#### Symptom: Health Check Timeout
```
ERROR: Health check timeout after 300 seconds
```

**Root Cause:** Application taking too long to start

**Solution:**
```bash
# Check Railway logs for startup issues
railway logs --service "AINative- Core -Production" | grep -E "(ERROR|CRITICAL)"

# Common causes:
# 1. Database connection failing (check DATABASE_URL)
# 2. Schema sync taking too long
# 3. Application initialization error

# Increase health check timeout in railway.toml:
healthcheckTimeout = 600  # 10 minutes
```

#### Symptom: Memory Limit Exceeded
```
ERROR: Container killed due to memory limit
```

**Root Cause:** Application using too much memory

**Solution:**
```bash
# Check memory usage in Railway metrics
# Go to: Railway Dashboard → Service → Metrics

# Optimize application:
# 1. Reduce database connection pool size
# 2. Implement pagination for large queries
# 3. Add memory limits to queries
# 4. Clear caches regularly

# Increase Railway memory limit (if needed)
# Go to: Railway Dashboard → Service → Settings → Resources
```

---

### 7. Secrets and Configuration

#### Symptom: Environment Variable Not Set
```
KeyError: 'SECRET_KEY'
```

**Root Cause:** Missing environment variable in Railway

**Solution:**
```bash
# Check current variables
railway variables --service "AINative- Core -Production"

# Add missing variable via CLI
railway variables set SECRET_KEY=your-secret-key

# Or via Railway dashboard:
# 1. Go to Service → Variables
# 2. Add new variable
# 3. Redeploy service
```

#### Symptom: Database URL Invalid
```
psycopg2.OperationalError: could not translate host name to address
```

**Root Cause:** Wrong DATABASE_URL format or missing

**Solution:**
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Should be:
# postgresql://user:password@host:6432/database
#                                    ^^^^
#                                 Use 6432 (PgBouncer), not 5432

# If wrong, update in Railway:
railway variables set DATABASE_URL="postgresql://user:pass@host:6432/db"
```

---

### 8. Git and GitHub Issues

#### Symptom: Pre-Push Hook Blocks Push
```
❌ Pre-deployment validation failed
Fix issues before pushing to main
```

**Root Cause:** Validation checks failing

**Solution:**
```bash
# Run validation manually to see specific issues
bash scripts/validate-pre-deployment.sh

# Fix each issue shown

# If you REALLY need to bypass (not recommended):
git push --no-verify
```

#### Symptom: PR Creation Failed
```
error: pull request create failed: GraphQL: Base branch not found
```

**Root Cause:** Branch doesn't exist on remote

**Solution:**
```bash
# Push branch first
git push -u origin $(git rev-parse --abbrev-ref HEAD)

# Then create PR
gh pr create --title "..." --body "..."
```

---

### 9. Performance Issues

#### Symptom: Slow Response Times
```
Health check response time: 5000ms (expected < 100ms)
```

**Root Cause:** Database queries not optimized

**Solution:**
```bash
# Enable query logging
# In src/backend/app/db/session.py:
# engine = create_engine(DATABASE_URL, echo=True)

# Identify slow queries
railway logs --service "AINative- Core -Production" | grep "SELECT"

# Optimize queries:
# 1. Add indexes
# 2. Use pagination
# 3. Implement caching
# 4. Use select_related/prefetch_related
```

#### Symptom: High CPU Usage
```
CPU usage: 95% (sustained)
```

**Root Cause:** Infinite loops or inefficient algorithms

**Solution:**
```bash
# Profile application
# Add profiling middleware in src/backend/app/main.py

# Check Railway metrics
# Identify spikes correlated with specific endpoints

# Optimize code:
# 1. Use generators instead of lists
# 2. Implement async/await properly
# 3. Cache expensive computations
```

---

## Emergency Procedures

### Immediate Rollback (Production Down)

```bash
# Step 1: Identify last good commit
git log --oneline -10

# Step 2: Revert bad commit
git revert <bad-commit-sha>

# Step 3: Push immediately
git push origin main

# Step 4: Monitor deployment
railway logs --service "AINative- Core -Production" --follow

# Step 5: Verify health
curl https://ainative-browser-builder.up.railway.app/health
```

### Database Recovery (Schema Corruption)

```bash
# Step 1: Create backup
pg_dump $DATABASE_URL > emergency_backup_$(date +%Y%m%d_%H%M%S).sql

# Step 2: Identify schema state
psql $DATABASE_URL -c "\dt"
psql $DATABASE_URL -c "SELECT * FROM alembic_version;"

# Step 3: Fix schema manually if needed
psql $DATABASE_URL < fix_schema.sql

# Step 4: Verify application starts
railway logs --service "AINative- Core -Production" --follow
```

### Complete Service Restart

```bash
# Via Railway CLI
railway restart --service "AINative- Core -Production"

# Or via Dashboard:
# 1. Go to Service
# 2. Settings → Restart Service
```

---

## Prevention Strategies

### 1. Always Run Pre-Deployment Validation
```bash
# Before every deployment
bash scripts/validate-pre-deployment.sh
```

### 2. Use Railway Deploy Script
```bash
# Instead of manual git push
bash scripts/railway-deploy.sh
```

### 3. Monitor Database Pool
```bash
# Check before and after deployments
python3 scripts/check_db_connection_pool.py
```

### 4. Test Locally First
```bash
# Build and run Docker locally
cd src/backend
docker build -f Dockerfile -t local-test .
docker run -p 8080:8080 -e PORT=8080 local-test

# Test endpoints
curl http://localhost:8080/health
```

### 5. Use Feature Branches
```bash
# Never commit directly to main
git checkout -b feature/123-new-feature

# Test in feature branch first
# Create PR for review
# Merge after approval
```

---

## Getting Help

### Check Documentation
- Railway Troubleshooting: `docs/deployment/RAILWAY_TROUBLESHOOTING.md`
- Kong Guide: `docs/deployment/KONG_DEPLOYMENT_GUIDE.md`
- Database Best Practices: `.claude/skills/database-query-best-practices`

### Check Logs
```bash
# Backend logs
railway logs --service "AINative- Core -Production" | tail -200

# Kong logs
railway logs --service kong-gateway | tail -200

# Search for specific errors
railway logs --service "AINative- Core -Production" | grep -i error
```

### Check Service Health
```bash
# Railway service status
railway status

# Backend health
curl https://ainative-browser-builder.up.railway.app/health

# Kong health
curl -I https://api.ainative.studio/health
```

### Contact Support
```bash
# Create issue with details
gh issue create --title "[BUG] Deployment failing with error X" --body "..."

# Include:
# 1. Error message
# 2. Railway logs
# 3. Steps to reproduce
# 4. Expected vs actual behavior
```
