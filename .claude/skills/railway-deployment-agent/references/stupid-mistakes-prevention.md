# Common Stupid Mistakes - Prevention Checklist

**Quick reference for agents to avoid the most common deployment mistakes**

---

## 🚨 TOP 10 STUPID MISTAKES (And How to Avoid Them)

### 1. Deploying from Main Branch

**Mistake:**
```bash
# Agent on main branch
git branch --show-current
# main

# Agent tries to deploy
git commit -m "Add feature"
git push origin main
# ❌ BLOCKED - Branch name validation fails
```

**Prevention:**
```bash
# ALWAYS work on feature branch
git checkout -b feature/1234-description

# Check branch before committing
git branch --show-current | grep -qE "^(feature|bug|test|refactor|docs|devops)/"
```

**Why This is Stupid:**
- Bypasses code review
- No PR workflow
- Violates MANDATORY workflow
- Pre-push hook will block you anyway

**Fix Time:** 2 minutes
**Prevented by:** Pre-push hook, validation script

---

### 2. Forgetting to Assign Issue

**Mistake:**
```bash
# Agent creates branch
git checkout -b feature/1234-description

# Agent forgets this step:
gh issue edit 1234 --add-assignee @me

# Deploy fails:
# ❌ Issue #1234 is not assigned to you
```

**Prevention:**
```bash
# FIRST STEP when starting work:
gh issue edit <issue-number> --add-assignee @me

# Add to muscle memory:
alias start-work='gh issue edit $1 --add-assignee @me && git checkout -b feature/$1-description'
```

**Why This is Stupid:**
- Takes 5 seconds to do
- MANDATORY requirement
- Always caught by validation
- Wastes time fixing later

**Fix Time:** 5 seconds
**Prevented by:** Validation script

---

### 3. Including AI Attribution

**Mistake:**
```bash
git commit -m "Add feature

Implemented new auth system.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# ❌ BLOCKED - AI attribution detected
```

**Prevention:**
```bash
# NEVER include:
# - Claude
# - Anthropic
# - Generated with
# - Co-Authored-By: Claude
# - Any AI tool names
# - Any "🤖 Generated" patterns

# Correct format:
git commit -m "[FEATURE] Add auth system - Refs #1234

- Implemented JWT tokens
- Added login endpoint
- Added tests

Refs #1234"
```

**Why This is Stupid:**
- ZERO TOLERANCE rule
- Clearly documented everywhere
- Pre-push hook checks this
- Forces you to amend commit

**Fix Time:** 1 minute (amend commit)
**Prevented by:** Pre-push hook, validation script

---

### 4. Using Wrong Database Port

**Mistake:**
```python
# Agent hardcodes database URL
DATABASE_URL = "postgresql://user:pass@host:5432/db"
#                                             ^^^^ WRONG!

# Connection fails:
# psycopg2.OperationalError: Connection refused
```

**Prevention:**
```python
# ALWAYS use environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

# Railway auto-sets with CORRECT port (6432)
```

**Key Facts:**
- Railway PostgreSQL is on port **6432** (PgBouncer)
- Port **5432** is NOT exposed
- **ALWAYS** use port 6432

**Why This is Stupid:**
- Documented everywhere
- Railway auto-sets DATABASE_URL correctly
- No reason to hardcode
- Breaks production immediately

**Fix Time:** 30 seconds (change port number)
**Prevented by:** Using environment variables

---

### 5. Kong Private Network DNS

**Mistake:**
```yaml
# kong/config/kong.yml
services:
  - name: backend
    url: http://cody.railway.internal:8080  # ❌ WRONG!

# All requests fail:
# 502 Bad Gateway - DNS resolution failed
```

**Prevention:**
```yaml
# ALWAYS use public URL
services:
  - name: backend
    url: https://ainative-browser-builder.up.railway.app  # ✅ CORRECT
    protocol: https
    host: ainative-browser-builder.up.railway.app
    port: 443
```

**Key Fact:**
**Kong CANNOT access Railway private network DNS**

**Why This is Stupid:**
- Documented in multiple places
- Known platform limitation
- Takes down entire API gateway
- Affects all users

**Fix Time:** 2 minutes (update config, redeploy)
**Prevented by:** Reading documentation

---

### 6. Skipping Tests

**Mistake:**
```bash
# Agent makes changes
vim src/backend/app/api/endpoints/auth.py

# Agent commits without testing
git add .
git commit -m "Add feature"
git push

# Production breaks:
# FAILED: 15 tests, 3 imports broken
```

**Prevention:**
```bash
# ALWAYS run tests before commit
cd src/backend
python3 -m pytest tests/ -v --cov=app --cov-report=term-missing

# Only commit if:
# ✅ All tests pass
# ✅ Coverage >= 80%
# ✅ No import errors
```

**Why This is Stupid:**
- TDD is MANDATORY
- Catches bugs before production
- Takes 30 seconds to run
- Costs hours to fix in production

**Fix Time:** 30 seconds (run tests)
**Cost of Skipping:** Hours (debugging production)
**Prevented by:** Mandatory TDD skill

---

### 7. Database Pool Exhaustion

**Mistake:**
```bash
# Agent has 5 dev servers running
npm run dev  # Running
npm run dev  # Running
python uvicorn  # Running
python uvicorn  # Running
python uvicorn  # Running

# Total connections: ~90
# Max connections: 100

# Deploy fails:
# QueuePool limit reached
```

**Prevention:**
```bash
# BEFORE deploying:
python3 scripts/check_db_connection_pool.py

# If > 75%, clean up:
pkill -9 -f "npm run dev"
pkill -9 -f "python.*uvicorn"
sleep 30

# Verify:
python3 scripts/check_db_connection_pool.py
# Should show < 75%
```

**Why This is Stupid:**
- Easy to check (1 command)
- Easy to fix (1 command)
- Blocks deployments
- Crashes production

**Fix Time:** 30 seconds (kill servers, wait)
**Prevented by:** Validation script

---

### 8. Files in Wrong Location

**Mistake:**
```bash
# Agent creates files in root
touch DEPLOYMENT_GUIDE.md
touch deploy.sh

git add .
git commit -m "Add docs"

# ❌ BLOCKED - Misplaced files
```

**Prevention:**
```bash
# Documentation
mkdir -p docs/deployment
touch docs/deployment/DEPLOYMENT_GUIDE.md

# Scripts
touch scripts/deploy.sh

# Root .md files (only these allowed)
# - README.md
# - CLAUDE.md
# Everything else → docs/{category}/
```

**Why This is Stupid:**
- Clear file placement rules
- Pre-commit hook blocks this
- Just move the file!
- Keeps repo organized

**Fix Time:** 10 seconds (move file)
**Prevented by:** Pre-commit hook, validation script

---

### 9. Committing Secrets

**Mistake:**
```python
# Agent hardcodes secrets
SECRET_KEY = "my-secret-key-12345"
DATABASE_PASSWORD = "password123"
API_KEY = "sk-abc123xyz"

git add .
git commit -m "Add config"

# ❌ BLOCKED - Secrets detected
```

**Prevention:**
```python
# ALWAYS use environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
API_KEY = os.getenv("API_KEY")

# Set in Railway:
railway variables set SECRET_KEY="your-secret"
```

**Why This is Stupid:**
- Major security violation
- Git history never forgets
- Must rotate secret immediately
- Costs hours to clean up

**Fix Time:** 1 minute (use env vars)
**Cost of Mistake:** Hours (secret rotation, git cleanup)
**Prevented by:** Validation script

---

### 10. Wrong Branch Name Format

**Mistake:**
```bash
# Agent creates lazy branch name
git checkout -b fix-bug
git checkout -b new-feature
git checkout -b updates

# Deploy blocked:
# ❌ Branch name must follow: [type]/[issue-number]-[slug]
```

**Prevention:**
```bash
# ALWAYS follow format
git checkout -b feature/1234-add-auth
git checkout -b bug/1234-fix-cors
git checkout -b test/1234-add-tests

# Valid types:
# feature, bug, test, refactor, docs, devops
```

**Why This is Stupid:**
- Clear format documented
- Takes 2 extra seconds
- Required for issue tracking
- Always caught by validation

**Fix Time:** 5 seconds (rename branch)
**Prevented by:** Validation script

---

## 🎯 Pre-Flight Checklist (Before Every Deployment)

Copy this checklist. Follow it EVERY TIME.

```
BEFORE STARTING WORK:
☐ Issue assigned to me (gh issue edit 1234 --add-assignee @me)
☐ Created proper branch (feature/1234-description)
☐ Database pool healthy (python3 scripts/check_db_connection_pool.py)

BEFORE COMMITTING:
☐ Tests pass (cd src/backend && pytest tests/ -v --cov=app)
☐ Coverage >= 80%
☐ No secrets in code (git diff | grep -iE "password|api_key")
☐ Files in correct location (docs/ or scripts/)
☐ No AI attribution in commit message
☐ Validation passes (bash scripts/validate-pre-deployment.sh)

BEFORE DEPLOYING:
☐ Run deployment script (bash scripts/railway-deploy.sh)
☐ Or manual: All items above + schema sync dry-run
☐ Monitor logs (railway logs --follow)
☐ Check health (curl health endpoint)
☐ Verify Kong (curl api.ainative.studio/health)

IF SOMETHING BREAKS:
☐ Check logs (railway logs --service "AINative- Core -Production")
☐ Rollback if needed (git revert HEAD && git push)
☐ Follow recovery guide (agent-recovery-guide.md)
```

---

## 🧠 Memorize These Commands

```bash
# Start work
gh issue edit 1234 --add-assignee @me
git checkout -b feature/1234-description

# Before commit
cd src/backend && pytest tests/ -v --cov=app
bash scripts/validate-pre-deployment.sh

# Deploy
bash scripts/railway-deploy.sh

# Monitor
railway logs --service "AINative- Core -Production" --follow

# Check health
curl https://ainative-browser-builder.up.railway.app/health

# Rollback
git revert HEAD && git push origin main
```

---

## ⚡ Quick Recovery

**If blocked, check:**

1. **Branch name?**
   ```bash
   git branch -m feature/1234-correct-name
   ```

2. **Issue assigned?**
   ```bash
   gh issue edit 1234 --add-assignee @me
   ```

3. **AI attribution?**
   ```bash
   git commit --amend  # Remove attribution
   ```

4. **Files wrong location?**
   ```bash
   git reset HEAD file.md
   mv file.md docs/category/
   ```

5. **Database pool?**
   ```bash
   pkill -9 -f "npm run dev" && sleep 30
   ```

6. **Tests failing?**
   ```bash
   cd src/backend && pytest tests/ -v
   # Fix failures, re-run
   ```

---

## 🎓 Learning from Mistakes

### If You Make These Mistakes

1. **Read the error message** - It tells you exactly what's wrong
2. **Follow recovery guide** - agent-recovery-guide.md has solutions
3. **Remember for next time** - Add to pre-flight checklist
4. **Use validation script** - It catches most issues

### Making Mistakes is OK IF

- You read the error message
- You follow the recovery steps
- You don't make the same mistake twice
- You use the validation tools provided

### Making Mistakes is NOT OK IF

- You skip validation repeatedly
- You ignore error messages
- You force push without fixing
- You break production and don't rollback

---

## 📊 Mistake Severity Scale

| Mistake | Severity | Fix Time | Prevention |
|---------|----------|----------|------------|
| Wrong branch name | Low | 5 sec | Validation |
| Issue not assigned | Low | 5 sec | Validation |
| AI attribution | Low | 1 min | Pre-push hook |
| Files wrong location | Low | 10 sec | Pre-commit hook |
| Skipping tests | Medium | 30 sec | TDD skill |
| Database pool | Medium | 30 sec | Validation |
| Wrong DB port | High | 30 sec | Env vars |
| Kong DNS error | High | 2 min | Documentation |
| Committing secrets | Critical | Hours | Validation + Git cleanup |
| Breaking production | Critical | 2 min | Tests + Validation |

---

## 🎯 Goal: Zero Stupid Mistakes

**How to Achieve:**

1. **ALWAYS run validation**
   ```bash
   bash scripts/validate-pre-deployment.sh
   ```

2. **ALWAYS use deployment script**
   ```bash
   bash scripts/railway-deploy.sh
   ```

3. **ALWAYS check before pushing**
   - Tests pass?
   - No AI attribution?
   - Files in correct location?
   - Database pool healthy?

4. **WHEN IN DOUBT**
   - Read the error message
   - Check recovery guide
   - Run validation again
   - Ask for help if stuck

---

## Remember

**Every stupid mistake:**
- Has a clear prevention step
- Has a quick recovery path
- Is caught by validation
- Can be avoided by following checklist

**The validation script exists for a reason. Use it.**

```bash
bash scripts/validate-pre-deployment.sh
```

**The deployment script exists for a reason. Use it.**

```bash
bash scripts/railway-deploy.sh
```

**The recovery guide exists for a reason. Read it.**

```bash
cat .claude/skills/railway-deployment-agent/references/agent-recovery-guide.md
```

**You have all the tools. Use them. Avoid stupid mistakes. Deploy with confidence.**
