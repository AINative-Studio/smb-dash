# Agent Recovery Guide - When Things Go Wrong

## 🆘 "I'm Stuck!" - Quick Recovery Paths

This guide helps agents recover from common mistakes and get back on track with Railway deployment.

---

## Critical Mistake #1: Wrong Branch Name

### Symptoms
```
❌ Branch name must follow: [type]/[issue-number]-[slug]
   Current: fix-bug
   Example: feature/1186-railway-deployment
```

### What Went Wrong
Agent created a branch without following the naming convention.

### Why This Matters
- Issue tracking requires issue numbers in branches
- Prevents proper commit/PR linking
- Blocks deployment validation

### Recovery Steps

**Option 1: Rename Current Branch**
```bash
# Get issue number from GitHub
gh issue list | grep "your issue title"
# Example output: #1234  Bug: Fix CORS issue

# Rename branch
git branch -m bug/1234-fix-cors-issue

# Verify
git branch --show-current
# Should show: bug/1234-fix-cors-issue
```

**Option 2: Create New Branch with Correct Name**
```bash
# Note your current work
git stash

# Create correctly named branch
git checkout -b feature/1234-description

# Restore your work
git stash pop

# Verify
bash scripts/validate-pre-deployment.sh
```

### Valid Branch Formats
```
feature/[number]-[slug]  # New features
bug/[number]-[slug]      # Bug fixes
test/[number]-[slug]     # Test additions
refactor/[number]-[slug] # Code refactoring
docs/[number]-[slug]     # Documentation
devops/[number]-[slug]   # DevOps/CI/CD
```

---

## Critical Mistake #2: Issue Not Assigned

### Symptoms
```
❌ Issue #1234 is not assigned to you
   Run: gh issue edit 1234 --add-assignee @me
```

### What Went Wrong
Agent started work on an issue without assigning it first.

### Why This Matters
- Shows ownership and prevents duplicate work
- Required by project workflow
- Blocks deployment validation

### Recovery Steps

**Step 1: Assign Issue to Yourself**
```bash
# Using GitHub CLI
gh issue edit 1234 --add-assignee @me

# Verify assignment
gh issue view 1234 | grep "assignees:"
# Should show your username
```

**Step 2: Re-run Validation**
```bash
bash scripts/validate-pre-deployment.sh
# Should now show: ✅ Issue #1234 is assigned to you
```

**If GitHub CLI Not Available:**
```
1. Go to https://github.com/your-org/core/issues/1234
2. Click "Assignees" on the right sidebar
3. Select yourself from the dropdown
4. Re-run validation
```

---

## Critical Mistake #3: AI Attribution in Commit

### Symptoms
```
❌ AI attribution found in last commit
   FORBIDDEN: Claude, Anthropic, Generated with, Co-Authored-By: Claude
```

### What Went Wrong
Agent included AI tool attribution in the commit message (ZERO TOLERANCE violation).

### Why This Matters
- Company policy: No AI attribution in commits/PRs
- Compromises professional appearance
- Automatic deployment block

### Recovery Steps

**Step 1: Amend Last Commit**
```bash
# Open editor to fix commit message
git commit --amend

# In editor, remove ALL lines containing:
# - Claude
# - Anthropic
# - Generated with
# - Co-Authored-By: Claude
# - Any AI tool references
# - Any emoji + "Generated with" patterns

# Save and close editor
```

**Step 2: Verify Clean Commit**
```bash
# Check commit message
git log -1 --pretty=%B

# Search for AI attribution
git log -1 --pretty=%B | grep -iE "(claude|anthropic|generated with|co-authored-by: claude)"

# Should return nothing (no matches)
```

**Step 3: Re-run Validation**
```bash
bash scripts/validate-pre-deployment.sh
# Should now show: ✅ No AI attribution in last commit
```

**Example Correct Commit:**
```
[FEATURE] Add multi-dimension vector support - Refs #1234

- Support for 384, 768, 1024, and 1536 dimensions
- Update validation logic for new dimensions
- Add comprehensive test coverage

Refs #1234
```

---

## Critical Mistake #4: Files in Wrong Location

### Symptoms
```
❌ Misplaced files found:
   DEPLOYMENT_GUIDE.md
   deploy.sh
   .md files → docs/{category}/
   .sh scripts → scripts/
```

### What Went Wrong
Agent created files in the root directory or wrong locations.

### Why This Matters
- Repository organization standards
- Pre-commit hook will block
- Keeps codebase clean and navigable

### Recovery Steps

**Step 1: Unstage Misplaced Files**
```bash
# Unstage specific files
git reset HEAD DEPLOYMENT_GUIDE.md deploy.sh

# Or unstage all
git reset HEAD .
```

**Step 2: Move to Correct Locations**
```bash
# Documentation files
mkdir -p docs/deployment
mv DEPLOYMENT_GUIDE.md docs/deployment/

# Scripts
mv deploy.sh scripts/

# Root .md files (only these allowed)
# - README.md (allowed)
# - CLAUDE.md (allowed)
# - Everything else → docs/{category}/
```

**Step 3: Stage Correctly Located Files**
```bash
# Stage files in correct locations
git add docs/deployment/DEPLOYMENT_GUIDE.md
git add scripts/deploy.sh

# Verify
bash scripts/validate-pre-deployment.sh
# Should now show: ✅ All files in correct locations
```

**Correct File Placement Reference:**
```
docs/
  ├── deployment/     # Deployment guides
  ├── api/           # API documentation
  ├── guides/        # User guides
  └── issues/        # Issue-specific docs

scripts/
  ├── *.sh          # Shell scripts
  └── *.py          # Python scripts

Root level:
  ├── README.md     # Only allowed root .md
  └── CLAUDE.md     # Only allowed root .md
```

---

## Critical Mistake #5: Database Pool Exhausted

### Symptoms
```
[0;31m❌ Database pool usage is high
   Pool Usage: CRITICAL (95%)
   Run: pkill -9 -f 'npm run dev' && sleep 30
```

### What Went Wrong
Too many development servers running, exhausting database connections.

### Why This Matters
- Blocks production database access
- Causes deployment failures
- Can crash production services

### Recovery Steps

**Step 1: Kill Development Servers**
```bash
# Kill all dev servers
pkill -9 -f "npm run dev"
pkill -9 -f "python.*uvicorn"
pkill -9 -f "node.*vite"

# Wait for connections to close
sleep 30
```

**Step 2: Verify Pool Recovery**
```bash
python3 scripts/check_db_connection_pool.py

# Should show:
# Pool Usage: HEALTHY (< 75%)
```

**Step 3: Prevent Future Issues**
```bash
# Before starting new dev server, check pool
python3 scripts/check_db_connection_pool.py

# If > 75%, clean up first
pkill -9 -f "npm run dev" && sleep 30
```

**Understanding the Problem:**
```
Max Connections: 100
Each dev server: ~15-20 connections
5 dev servers = 75-100 connections = Pool exhausted!

Solution: Stop dev servers before deploying
```

---

## Critical Mistake #6: Skipping Tests

### Symptoms
```
⚠️  Tests should be run manually before deployment
   Run: cd src/backend && python3 -m pytest tests/ -v
```

### What Went Wrong
Agent didn't run tests before deployment.

### Why This Matters
- Broken code could reach production
- TDD requirement violation
- No proof of test coverage

### Recovery Steps

**Step 1: Run Tests with Coverage**
```bash
cd src/backend
python3 -m pytest tests/ -v --cov=app --cov-report=term-missing
```

**Step 2: Interpret Results**

**If tests PASS (✅):**
```
==================== 42 passed in 5.23s ====================
Coverage: 87%

✅ Ready to deploy
Save output for PR:
python3 -m pytest tests/ -v --cov=app > test_results.txt
```

**If tests FAIL (❌):**
```
FAILED tests/test_auth.py::test_login - AssertionError

❌ STOP - Do not deploy
Fix failing tests first:
1. Read error message
2. Fix the code
3. Re-run tests
4. Repeat until all pass
```

**If coverage < 80% (⚠️):**
```
Coverage: 72%

❌ STOP - Coverage too low
Add more tests:
1. Run with missing lines: pytest --cov=app --cov-report=html
2. Open htmlcov/index.html
3. Write tests for uncovered lines
4. Re-run until >= 80%
```

**Step 3: Include Test Output in PR**
```bash
# Save test results
cd src/backend
python3 -m pytest tests/ -v --cov=app --cov-report=term-missing > test_results.txt

# Reference in PR description
cat test_results.txt
```

---

## Critical Mistake #7: Trying to Deploy from Main

### Symptoms
```
❌ Branch name must follow: [type]/[issue-number]-[slug]
   Current: main
```

### What Went Wrong
Agent is trying to commit directly to main branch.

### Why This Matters
- Bypasses code review
- No PR workflow
- Violates best practices

### Recovery Steps

**Step 1: Create Feature Branch**
```bash
# Stash current changes
git stash

# Create feature branch
git checkout -b feature/1234-description

# Restore changes
git stash pop
```

**Step 2: Commit to Feature Branch**
```bash
# Stage changes
git add .

# Commit (no AI attribution!)
git commit -m "[FEATURE] Description - Refs #1234"

# Push to feature branch
git push -u origin feature/1234-description
```

**Step 3: Create Pull Request**
```bash
gh pr create --title "[FEATURE] Description - Fixes #1234" --body "..."

# After approval, merge to main
gh pr merge --squash
```

---

## Critical Mistake #8: Using Wrong Database Port

### Symptoms
```
psycopg2.OperationalError: could not connect to database
Connection refused on port 5432
```

### What Went Wrong
Agent used port 5432 instead of 6432 (PgBouncer).

### Why This Matters
- Railway uses PgBouncer on port 6432
- Port 5432 is not exposed
- Connections will fail

### Recovery Steps

**Step 1: Check Current DATABASE_URL**
```bash
echo $DATABASE_URL
# Look for port number in URL
```

**Step 2: Fix Connection String**
```bash
# WRONG (will fail):
postgresql://user:pass@host:5432/db

# CORRECT (use this):
postgresql://user:pass@host:6432/db
```

**Step 3: Update Environment Variable**
```bash
# In Railway dashboard:
# 1. Go to Service → Variables
# 2. Find DATABASE_URL
# 3. Change port from 5432 to 6432
# 4. Redeploy service

# Or via CLI:
railway variables set DATABASE_URL="postgresql://user:pass@host:6432/db"
```

**Step 4: Update Code (if hardcoded)**
```python
# WRONG - Don't hardcode:
DATABASE_URL = "postgresql://user:pass@host:5432/db"

# CORRECT - Use environment variable:
DATABASE_URL = os.getenv("DATABASE_URL")
# Railway auto-sets with correct port (6432)
```

---

## Critical Mistake #9: Kong Configuration Error

### Symptoms
```
curl https://api.ainative.studio/health
HTTP/1.1 502 Bad Gateway
dns resolution failed: 3 name error
```

### What Went Wrong
Kong is trying to use Railway private network DNS instead of public URL.

### Why This Matters
- Kong CANNOT access Railway private network
- All requests will fail with 502
- Production API is down

### Recovery Steps

**Step 1: Check Kong Configuration**
```bash
cat kong/config/kong.yml | grep -A5 "url:"
```

**Step 2: Verify Upstream URL**

**WRONG (will cause DNS errors):**
```yaml
url: http://cody.railway.internal:8080
url: http://cody:8080
url: https://api.ainative.studio  # Circular!
```

**CORRECT (use this):**
```yaml
url: https://ainative-browser-builder.up.railway.app
protocol: https
host: ainative-browser-builder.up.railway.app
port: 443
```

**Step 3: Fix Configuration**
```bash
# Edit kong/config/kong.yml
# Change upstream to public URL

# Commit and deploy
git add kong/config/kong.yml
git commit -m "[FIX] Update Kong upstream to public URL - Refs #734"
git push origin main
```

**Step 4: Verify Fix**
```bash
# Wait for deployment (~2 minutes)
railway logs --service kong-gateway --follow

# Test Kong health
curl -I https://api.ainative.studio/health | grep via
# Should show: via: 1.1 kong/3.8.0
```

---

## Critical Mistake #10: Committing Secrets

### Symptoms
```
❌ Potential secrets found in staged changes
   Use environment variables instead
```

### What Went Wrong
Agent included hardcoded passwords, API keys, or tokens in code.

### Why This Matters
- Security vulnerability
- Secrets exposed in git history
- Compliance violation

### Recovery Steps

**Step 1: Unstage Files with Secrets**
```bash
git reset HEAD .
```

**Step 2: Remove Secrets from Code**
```python
# WRONG - Hardcoded:
SECRET_KEY = "my-secret-key-123"
DATABASE_PASSWORD = "password123"
API_KEY = "sk-abc123xyz"

# CORRECT - Environment variables:
SECRET_KEY = os.getenv("SECRET_KEY")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
API_KEY = os.getenv("API_KEY")
```

**Step 3: Add Secrets to Railway**
```bash
# Via Railway CLI
railway variables set SECRET_KEY="your-secret-here"
railway variables set API_KEY="your-api-key-here"

# Or via Railway dashboard:
# 1. Go to Service → Variables
# 2. Add new variable
# 3. Set value
# 4. Redeploy
```

**Step 4: Update .gitignore**
```bash
# Add to .gitignore
echo "*.env" >> .gitignore
echo ".env.local" >> .gitignore
echo "secrets.json" >> .gitignore

# Commit .gitignore
git add .gitignore
git commit -m "[SECURITY] Add secrets to gitignore - Refs #1234"
```

**Step 5: Clean Git History (if already committed)**
```bash
# If secret already committed:
# 1. Rotate the secret immediately
# 2. Use BFG Repo-Cleaner to remove from history
# 3. Force push (requires approval)

# Prevent this: Always run validation before commit
bash scripts/validate-pre-deployment.sh
```

---

## Agent Confusion #1: "Which Railway Command Should I Use?"

### Common Questions

**Q: How do I check if deployment is working?**
```bash
# Backend health
curl https://ainative-browser-builder.up.railway.app/health

# Kong health
curl -I https://api.ainative.studio/health | grep via
```

**Q: How do I see logs?**
```bash
# Follow logs in real-time
railway logs --service "AINative- Core -Production" --follow

# Last 100 lines
railway logs --service "AINative- Core -Production" | tail -100
```

**Q: How do I restart a service?**
```bash
railway restart --service "AINative- Core -Production"
```

**Q: How do I force a deployment?**
```bash
# Method 1: Redeploy (recommended)
railway redeploy --service "AINative- Core -Production"

# Method 2: Empty commit
git commit --allow-empty -m "[DEPLOY] Force rebuild"
git push origin main
```

**Q: How do I connect to database?**
```bash
# Via Railway CLI
railway connect PostgreSQL

# Or with psql
railway run psql $DATABASE_URL
```

---

## Agent Confusion #2: "Pre-Push Hook Blocked Me!"

### Symptoms
```
❌ Pre-deployment validation failed
Fix issues before pushing to main
```

### What This Means
The pre-push hook ran validation and found issues.

### Recovery Steps

**Step 1: See What Failed**
```bash
# Run validation manually to see details
bash scripts/validate-pre-deployment.sh

# Fix each issue shown
```

**Step 2: Fix Issues**
Follow recovery steps for each specific error (see above).

**Step 3: Try Push Again**
```bash
# After fixing issues
git push origin main

# Hook will run again and should pass
```

**Emergency Bypass (NOT RECOMMENDED):**
```bash
# Only if absolutely necessary
git push --no-verify

# But seriously, fix the issues instead
```

---

## Agent Confusion #3: "Deployment Takes Too Long!"

### Normal Timeline
```
0:00 - Push to main
0:05 - Railway receives webhook
0:30 - Docker build (with cache)
1:00 - Tests run in CI
1:30 - Docker build complete
2:00 - Schema sync runs
2:15 - Container starts
2:30 - Health check passes
2:45 - Deployment complete ✅

Total: 2-5 minutes (normal)
```

### If Stuck > 10 Minutes

**Step 1: Check Railway Logs**
```bash
railway logs --service "AINative- Core -Production" --follow

# Look for:
# - "Building..." (should complete in 1-2 min)
# - "Deploying..." (should complete in 30 sec)
# - ERROR or CRITICAL messages
```

**Step 2: Common Delays**

**Docker Build Slow:**
```
Cause: No cache hits, rebuilding from scratch
Fix: Wait (first deploy takes longer)
```

**Health Check Timeout:**
```
Cause: Application taking > 300s to start
Fix: Check logs for startup errors
```

**Schema Sync Hanging:**
```
Cause: Database migration error
Fix: Check schema sync logs
```

**Step 3: Cancel and Retry**
```bash
# Cancel stuck deployment
# Go to Railway Dashboard → Deployments → Cancel

# Retry deployment
railway redeploy --service "AINative- Core -Production"
```

---

## Emergency: "I Broke Production!"

### Immediate Actions

**Step 1: Verify Production is Down**
```bash
curl https://ainative-browser-builder.up.railway.app/health
curl -I https://api.ainative.studio/health

# If both fail → Production is down
```

**Step 2: Immediate Rollback**
```bash
# Revert bad commit
git revert HEAD

# Push immediately
git push origin main

# Monitor deployment
railway logs --service "AINative- Core -Production" --follow
```

**Step 3: Verify Recovery**
```bash
# Wait for deployment (~2 minutes)
# Test health
curl https://ainative-browser-builder.up.railway.app/health

# Should return: {"status": "healthy"}
```

**Step 4: Post-Incident**
```bash
# Create incident report
gh issue create --title "[INCIDENT] Production down - rollback" \
  --body "..."

# Document what happened
# Document how to prevent
# Create follow-up tasks
```

---

## Prevention: "How Do I Avoid These Mistakes?"

### Before Starting Work

```bash
# 1. Assign issue to yourself
gh issue edit 1234 --add-assignee @me

# 2. Create properly named branch
git checkout -b feature/1234-description

# 3. Check database pool
python3 scripts/check_db_connection_pool.py

# 4. Verify tests pass
cd src/backend && pytest tests/ -v
```

### Before Committing

```bash
# 1. Run validation
bash scripts/validate-pre-deployment.sh

# 2. Check for secrets
git diff | grep -iE "(password|api_key|secret|token)\s*=\s*['\"]"

# 3. Verify no AI attribution
git log -1 --pretty=%B | grep -iE "(claude|anthropic)"

# 4. Check file locations
git diff --cached --name-only | grep -E '^\w+\.md$'
```

### Before Deploying

```bash
# 1. Use deployment script (includes validation)
bash scripts/railway-deploy.sh

# Or manual checklist:
# 2. All tests pass
cd src/backend && pytest tests/ -v --cov=app

# 3. Schema sync dry-run
python3 scripts/sync-production-schema.py --dry-run

# 4. Database pool healthy
python3 scripts/check_db_connection_pool.py

# 5. No AI attribution
git log -1 --pretty=%B | grep -iE "(claude|anthropic)"
```

---

## Quick Reference: Recovery Command Cheat Sheet

```bash
# Wrong branch name
git branch -m feature/1234-correct-name

# Issue not assigned
gh issue edit 1234 --add-assignee @me

# AI attribution
git commit --amend  # Remove attribution

# Files wrong location
git reset HEAD file.md
mv file.md docs/category/
git add docs/category/file.md

# Database pool exhausted
pkill -9 -f "npm run dev" && sleep 30
python3 scripts/check_db_connection_pool.py

# Tests not run
cd src/backend && pytest tests/ -v --cov=app

# Production broken
git revert HEAD && git push origin main

# Deployment stuck
railway logs --service "AINative- Core -Production"
railway redeploy --service "AINative- Core -Production"

# Re-run validation
bash scripts/validate-pre-deployment.sh

# Re-run deployment
bash scripts/railway-deploy.sh
```

---

## When All Else Fails

### Get Help

**1. Check Documentation**
```bash
# Main skill guide
cat .claude/skills/railway-deployment-agent/SKILL.md

# Troubleshooting guide
cat .claude/skills/railway-deployment-agent/references/troubleshooting-guide.md

# Railway CLI setup
cat .claude/skills/railway-deployment-agent/references/railway-cli-setup.md
```

**2. Check Railway Logs**
```bash
railway logs --service "AINative- Core -Production" | tail -200

# Search for errors
railway logs --service "AINative- Core -Production" | grep -i error
```

**3. Create GitHub Issue**
```bash
gh issue create \
  --title "[BUG] Deployment issue: [description]" \
  --body "## Problem
[What happened]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]

## Error Messages
[Paste error messages]

## Logs
[Paste Railway logs]

## What I Tried
[What you tried to fix it]"
```

**4. Ask for Human Help**
```
Include in request:
- What you were trying to do
- What went wrong
- Error messages
- Validation output
- Railway logs
- What you tried to fix it
```

---

## Remember

### Golden Rules

1. **Always run validation before deploying**
   ```bash
   bash scripts/validate-pre-deployment.sh
   ```

2. **Never skip tests**
   ```bash
   cd src/backend && pytest tests/ -v --cov=app
   ```

3. **No AI attribution (zero tolerance)**
   - Never include: Claude, Anthropic, tool names
   - Pre-push hook checks this

4. **Use port 6432 for database**
   - NOT 5432
   - PgBouncer is on 6432

5. **Kong uses public URLs only**
   - NOT Railway private network
   - Use: ainative-browser-builder.up.railway.app

6. **When in doubt, validate**
   ```bash
   bash scripts/validate-pre-deployment.sh
   ```

7. **When stuck, check logs**
   ```bash
   railway logs --service "AINative- Core -Production"
   ```

8. **When broken, rollback**
   ```bash
   git revert HEAD && git push origin main
   ```

### You Can Recover

Every mistake has a recovery path. Follow the steps above, check validation, and you'll get back on track.

**Most Important:** Don't panic, read the error message, follow recovery steps.
