# Railway Deployment - Agent Quick Start Guide

**🚀 5-Minute Guide to Deploy to Railway Without Breaking Things**

---

## 📋 What You Need to Know

**This system prevents you from making stupid mistakes.**

It has:
- ✅ Validation that blocks bad deployments
- ✅ Hooks that auto-check your work
- ✅ Recovery guides when things go wrong
- ✅ Prevention checklists to avoid mistakes

**Goal: Deploy safely, quickly, confidently.**

---

## 🎯 The 3-Step Deployment Process

### Step 1: Before You Start

```bash
# Assign issue to yourself (REQUIRED)
gh issue edit <issue-number> --add-assignee @me

# Create proper branch (REQUIRED)
git checkout -b feature/<issue-number>-description
# Examples: feature/1234-add-auth, bug/1234-fix-cors

# Check database pool (RECOMMENDED)
python3 scripts/check_db_connection_pool.py
```

### Step 2: Deploy

```bash
# Recommended: Use deployment script (has all validation)
bash scripts/railway-deploy.sh

# Or manually:
# 1. Stage changes
git add .

# 2. Commit (NO AI ATTRIBUTION!)
git commit -m "[TYPE] Description - Refs #<issue>"

# 3. Push (triggers Railway deployment)
git push origin main
```

### Step 3: Monitor

```bash
# Watch logs
railway logs --service "AINative- Core -Production" --follow

# Check health
curl https://ainative-browser-builder.up.railway.app/health

# Verify Kong
curl -I https://api.ainative.studio/health | grep via
```

**Typical deployment: 2-5 minutes**

---

## 🚨 When Things Go Wrong

### Quick Recovery Reference

| Error | Fix |
|-------|-----|
| Wrong branch name | `git branch -m feature/1234-correct-name` |
| Issue not assigned | `gh issue edit 1234 --add-assignee @me` |
| AI attribution | `git commit --amend` (remove attribution) |
| Files wrong location | `git reset HEAD file.md && mv file.md docs/category/` |
| Database pool exhausted | `pkill -9 -f "npm run dev" && sleep 30` |
| Tests failing | `cd src/backend && pytest tests/ -v` |

**Full recovery guide:** `references/agent-recovery-guide.md`

---

## ⚠️ Top 10 Stupid Mistakes (DON'T DO THESE)

1. ❌ Deploying from main branch → Create feature branch first
2. ❌ Forgetting issue assignment → Assign before starting
3. ❌ AI attribution in commits → NEVER include Claude/Anthropic
4. ❌ Wrong database port (5432) → Always use 6432 (PgBouncer)
5. ❌ Kong private DNS → Use public URL only
6. ❌ Skipping tests → Always run before commit
7. ❌ Database pool exhausted → Check before deploying
8. ❌ Files in wrong location → docs/ for .md, scripts/ for .sh
9. ❌ Committing secrets → Use environment variables
10. ❌ Wrong branch name → Follow [type]/[number]-[slug]

**All mistakes have < 5 minute fixes. See:** `references/stupid-mistakes-prevention.md`

---

## 🎓 Documentation Quick Links

### When You Need

| Need | Read This |
|------|-----------|
| **How to deploy** | `SKILL.md` (main guide) |
| **CLI login steps** | `references/railway-cli-setup.md` |
| **Mistake recovery** | `references/agent-recovery-guide.md` |
| **Avoid mistakes** | `references/stupid-mistakes-prevention.md` |
| **Quick commands** | `references/quick-commands.md` |
| **Debugging issues** | `references/troubleshooting-guide.md` |

### Most Common Commands

```bash
# Validate before deploy
bash scripts/validate-pre-deployment.sh

# Deploy (recommended)
bash scripts/railway-deploy.sh

# Check logs
railway logs --service "AINative- Core -Production" --follow

# Check health
curl https://ainative-browser-builder.up.railway.app/health

# Rollback (emergency)
git revert HEAD && git push origin main
```

---

## 🏁 Pre-Flight Checklist

**Copy this. Use EVERY TIME.**

```
BEFORE STARTING:
☐ Issue assigned to me
☐ Created proper branch (feature/1234-description)
☐ Database pool < 75%

BEFORE COMMITTING:
☐ Tests pass (pytest)
☐ Coverage >= 80%
☐ No secrets in code
☐ Files in correct location
☐ No AI attribution
☐ Validation passes

BEFORE DEPLOYING:
☐ Run deployment script OR manual checklist above
☐ Monitor logs
☐ Check health endpoints
```

---

## 🆘 "I'm Stuck!" - Quick Help

### Validation Blocked Me
```bash
# See what failed
bash scripts/validate-pre-deployment.sh

# Fix each issue shown
# Re-run validation
```

### Pre-Push Hook Blocked Me
```bash
# Hook runs validation automatically
# Follow the error messages
# Fix issues, try again
```

### Production is Down (EMERGENCY)
```bash
# Immediate rollback
git revert HEAD
git push origin main

# Monitor recovery
railway logs --service "AINative- Core -Production" --follow

# Verify health
curl https://ainative-browser-builder.up.railway.app/health
```

### Deployment Taking Too Long (> 10 min)
```bash
# Check logs for errors
railway logs --service "AINative- Core -Production"

# Cancel and retry if stuck
# Railway Dashboard → Deployments → Cancel → Redeploy
```

---

## 💡 Key Facts to Remember

### Railway Services (5 total)
1. **Backend API** - `ainative-browser-builder.up.railway.app`
2. **Kong Gateway** - `api.ainative.studio:8000`
3. **PostgreSQL** - Port 6432 (NOT 5432!)
4. **Redis** - Port 6379 (optional)
5. **Embedding Service** - Semantic search (optional)

### Critical Rules
- ✅ ALWAYS use port **6432** for database (PgBouncer)
- ✅ Kong MUST use **public URLs** (not private network DNS)
- ✅ NEVER include AI attribution (ZERO TOLERANCE)
- ✅ ALWAYS run tests before deploying (TDD REQUIRED)
- ✅ ALWAYS assign issue before starting work

### Validation Catches
- Wrong branch names (100%)
- Missing issue assignments (100%)
- AI attribution (100%)
- Misplaced files (100%)
- Database pool issues (100%)
- Secrets in code (100%)

**Validation exists for a reason. Use it.**

---

## 🎯 Your First Deployment

**Follow these exact steps:**

```bash
# 1. Get issue number
gh issue list | grep "your task"
# Example: #1234  Add new feature

# 2. Assign to yourself
gh issue edit 1234 --add-assignee @me

# 3. Create branch
git checkout -b feature/1234-add-new-feature

# 4. Make changes
# ... edit files ...

# 5. Run tests
cd src/backend
python3 -m pytest tests/ -v --cov=app --cov-report=term-missing
cd ../..

# 6. Validate
bash scripts/validate-pre-deployment.sh

# 7. Deploy
bash scripts/railway-deploy.sh

# 8. Monitor
railway logs --service "AINative- Core -Production" --follow

# 9. Verify
curl https://ainative-browser-builder.up.railway.app/health

# 10. Success! 🎉
```

---

## 📞 Get Help

### Self-Help (Try First)
1. Read error message carefully
2. Check recovery guide: `references/agent-recovery-guide.md`
3. Run validation: `bash scripts/validate-pre-deployment.sh`
4. Check logs: `railway logs --service "AINative- Core -Production"`

### Ask for Help (If Still Stuck)
```bash
gh issue create \
  --title "[HELP] Brief description" \
  --body "## Problem
[What you're trying to do]

## Error
[Error message]

## What I Tried
[Steps you took]

## Logs
[Railway logs]"
```

---

## ✅ Success Metrics

**You've deployed successfully when:**

- ✅ Validation passed
- ✅ Tests passed (>= 80% coverage)
- ✅ Health check returns 200
- ✅ Kong headers present
- ✅ No errors in logs
- ✅ Database pool < 75%
- ✅ Response time < 100ms

---

## 🎓 Learning Resources

**In Order of Importance:**

1. **This file** - Quick start guide (you are here)
2. **stupid-mistakes-prevention.md** - Avoid common errors
3. **agent-recovery-guide.md** - Fix mistakes when they happen
4. **SKILL.md** - Complete deployment workflow
5. **railway-cli-setup.md** - CLI details, service info
6. **quick-commands.md** - Command reference
7. **troubleshooting-guide.md** - Deep debugging

**Read the first 3, reference the others as needed.**

---

## 🚀 Ready to Deploy?

```bash
# Start here
bash scripts/validate-pre-deployment.sh

# If validation passes
bash scripts/railway-deploy.sh

# Monitor deployment
railway logs --service "AINative- Core -Production" --follow

# Verify success
curl https://ainative-browser-builder.up.railway.app/health
```

**You have all the tools. You have all the documentation. Deploy with confidence.**

---

## Remember

- **Validation exists to help you, not block you**
- **Every mistake has a recovery path (< 5 minutes)**
- **Documentation has all the answers**
- **When in doubt, validate**
- **When stuck, check recovery guide**
- **When broken, rollback and fix**

**You got this! 🚀**
