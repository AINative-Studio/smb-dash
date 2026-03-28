# Railway Deployment Agent Skill

**Zero-error, fast deployment system for Railway with auto-triggered git hooks**

## What This Skill Does

This skill provides agents with a complete deployment workflow for Railway that:

1. **Validates before deployment** - Catches all common issues before they cause failures
2. **Auto-triggers on git push** - Pre-push hook validates automatically
3. **Optimizes for speed** - Typical deployment: 2-5 minutes
4. **Provides comprehensive debugging** - Step-by-step troubleshooting for all issues
5. **Integrates with existing skills** - Works seamlessly with TDD, git-workflow, schema-sync, etc.

## When to Use This Skill

Use this skill when:
- Deploying to Railway production
- Debugging deployment failures
- Setting up CI/CD for Railway platform
- Validating code before pushing to main
- Troubleshooting Railway-specific issues
- Rolling back failed deployments

## Quick Start

### For Agents: Deploy to Railway

```bash
# Step 1: Run validation
bash scripts/validate-pre-deployment.sh

# Step 2: Deploy
bash scripts/railway-deploy.sh

# Step 3: Monitor
railway logs --service "AINative- Core -Production" --follow
```

### For Agents: Debug Deployment

```bash
# Check health
curl https://ainative-browser-builder.up.railway.app/health

# Check logs
railway logs --service "AINative- Core -Production" | tail -100

# Check database pool
python3 scripts/check_db_connection_pool.py
```

## Files in This Skill

### Core Skill Guide
- **SKILL.md** - Complete deployment workflow
  - Pre-deployment validation checklist (8 critical checks)
  - Step-by-step deployment process
  - Zero-error debugging procedures
  - Git hook auto-trigger setup
  - Integration with all existing skills
  - Fast deployment optimization
  - Common pitfalls to avoid

### Reference Documentation
- **references/quick-commands.md** - Command reference
  - Pre-deployment commands
  - Deployment commands
  - Monitoring commands
  - Debugging commands
  - Rollback commands
  - PR commands
  - Database commands
  - Useful aliases

- **references/troubleshooting-guide.md** - Comprehensive debugging
  - Common deployment failures (with solutions)
  - Database issues (QueuePool, schema sync, connection errors)
  - Test failures (CI vs local, import errors, coverage)
  - Kong gateway issues (502, DNS, 404 errors)
  - Build failures (Docker, dependencies)
  - Runtime errors (startup, health check, memory)
  - Git issues (hooks, PR creation)
  - Emergency procedures (rollback, recovery)

## Scripts Created

### Validation Script
**Location:** `scripts/validate-pre-deployment.sh`

Runs 8 critical checks:
1. Branch name convention
2. GitHub issue assignment
3. No AI attribution in commits
4. File placement rules
5. Database connection pool health
6. Test reminder (manual verification)
7. Schema sync availability
8. No secrets in code

### Deployment Script
**Location:** `scripts/railway-deploy.sh`

Complete deployment workflow:
1. Runs pre-deployment validation
2. Executes backend tests
3. Runs schema sync dry-run
4. Prompts for commit message
5. Validates commit message format
6. Checks for AI attribution
7. Stages and commits changes
8. Pushes to main (triggers Railway)
9. Provides monitoring instructions

Options:
- `--dry-run` - Validation only, no push
- `--skip-tests` - Skip test execution (not recommended)
- `--message "msg"` - Provide commit message

## Git Hooks

### Pre-Push Hook
**Location:** `.git/hooks/pre-push`

Automatically validates before pushing to main:
- Runs `validate-pre-deployment.sh`
- Blocks push if validation fails
- Only runs on main branch pushes
- Can bypass with `--no-verify` (not recommended)

## Integration with Existing Skills

This skill integrates with:

1. **mandatory-tdd** - Enforces test execution, 80%+ coverage
2. **git-workflow** - Enforces no AI attribution, clean commits
3. **database-schema-sync** - Auto-runs on deploy, dry-run validation
4. **ci-cd-compliance** - GitHub Actions gates, auto-deploy
5. **delivery-checklist** - Pre-deployment aligns with checklist
6. **file-placement** - Validates file locations
7. **story-workflow** - Issue tracking, branch naming

## Railway Configuration

### Environment Variables (Set in Railway Dashboard)

**Required:**
- `PORT` - Auto-set by Railway
- `DATABASE_URL` - Auto-set when PostgreSQL added
- `SECRET_KEY` - Set manually (JWT signing)
- `BACKEND_CORS_ORIGINS` - Allowed origins

**Optional:**
- `LOG_LEVEL` - Default: "INFO"
- `REDIS_URL` - If using Redis
- `EMBEDDING_SERVICE_URL` - For semantic search

### Railway Services

**Backend:** "AINative- Core -Production"
- Public: `https://ainative-browser-builder.up.railway.app`
- Port: 8080 (HTTP), 443 (HTTPS)
- Auto-deploys on push to main

**Kong Gateway:** "kong-gateway"
- Public: `https://api.ainative.studio:8000`
- Upstream: `https://ainative-browser-builder.up.railway.app:443`
- Routes all API traffic

**Database:**
- Port: 6432 (PgBouncer) - NOT 5432
- Pool: 20 connections per instance
- Auto-provisioned by Railway

## Success Metrics

Deployment is successful when:

- ✅ All validation checks pass
- ✅ Tests pass with >= 80% coverage
- ✅ Schema sync completes without errors
- ✅ Health check returns HTTP 200
- ✅ Kong gateway responds correctly
- ✅ Database connection pool < 75%
- ✅ No ERROR/CRITICAL logs
- ✅ Response time < 100ms

## Common Issues and Solutions

### Issue: Pre-Push Hook Blocks Deployment
**Solution:** Run `bash scripts/validate-pre-deployment.sh` to see specific issues

### Issue: Database Pool Exhausted
**Solution:** `python3 scripts/check_db_connection_pool.py && pkill -9 -f "npm run dev"`

### Issue: Kong Returns 502
**Solution:** Check backend first: `curl https://ainative-browser-builder.up.railway.app/health`

### Issue: Tests Failing in CI
**Solution:** Reproduce CI environment: `export DATABASE_URL="postgresql://postgres:postgres@localhost/cody_test"`

For more issues, see: `references/troubleshooting-guide.md`

## Best Practices for Agents

1. **Always validate before deploying**
   - Run `bash scripts/validate-pre-deployment.sh`
   - Fix all critical issues
   - Address warnings if possible

2. **Use the deployment script**
   - `bash scripts/railway-deploy.sh`
   - Includes all validation and checks
   - Provides clear instructions

3. **Monitor deployments**
   - Watch logs: `railway logs --service "AINative- Core -Production" --follow`
   - Check health after deploy
   - Verify Kong gateway working

4. **Never skip tests**
   - Tests must pass before deployment
   - Minimum 80% coverage required
   - Include test output in PRs

5. **No AI attribution (zero tolerance)**
   - Never include: Claude, Anthropic, tool names
   - Validation checks every commit
   - Hook blocks pushes with attribution

6. **Follow file placement rules**
   - Documentation → `docs/{category}/`
   - Scripts → `scripts/`
   - Pre-commit hook enforces

7. **Keep database pool healthy**
   - Check before deploy: `python3 scripts/check_db_connection_pool.py`
   - Kill dev servers if needed
   - Monitor pool usage

## Documentation

**Main Guide:** `docs/deployment/RAILWAY_AGENT_DEPLOYMENT_GUIDE.md`

**Railway Docs:**
- Troubleshooting: `docs/deployment/RAILWAY_TROUBLESHOOTING.md`
- Deployment Guide: `docs/deployment/RAILWAY_DEPLOYMENT_GUIDE.md`
- Kong Guide: `docs/deployment/KONG_DEPLOYMENT_GUIDE.md`

**Skill References:**
- Quick Commands: `references/quick-commands.md`
- Troubleshooting: `references/troubleshooting-guide.md`

## Skill Metadata

**Name:** railway-deployment-agent

**Description:** Complete Railway deployment workflow with zero-error validation, auto-triggered git hooks, and fast deployment optimization. Use when deploying to Railway production, debugging deployment failures, or setting up CI/CD for Railway platform.

**Version:** 1.0.0

**Created:** 2026-03-06

**Dependencies:**
- Railway CLI (`railway`)
- GitHub CLI (`gh`)
- PostgreSQL client (`psql`)
- Python 3.12+
- pytest (for testing)

**Triggers:**
- Deploying to Railway production
- Debugging deployment failures
- Setting up CI/CD workflows
- Validating code before push
- Troubleshooting Railway issues
- Rolling back deployments

## Example Agent Workflow

```
Agent receives task: "Deploy the new authentication feature to Railway"

Agent thinks:
1. This involves Railway deployment
2. Should use railway-deployment-agent skill
3. Need to validate before deploying

Agent executes:
1. bash scripts/validate-pre-deployment.sh
   → Checks all 8 validation criteria
   → Identifies issue: branch name incorrect

2. git checkout -b feature/1234-auth-system
   → Creates correctly named branch

3. bash scripts/validate-pre-deployment.sh
   → All checks pass

4. bash scripts/railway-deploy.sh
   → Runs validation
   → Executes tests
   → Checks schema sync
   → Prompts for commit message
   → Creates commit (no AI attribution)
   → Pushes to main
   → Railway auto-deploys

5. railway logs --service "AINative- Core -Production" --follow
   → Monitors deployment
   → Verifies success

6. curl https://ainative-browser-builder.up.railway.app/health
   → Confirms health check passing

Result: Deployment successful, zero errors
```

## Support

**For agents encountering issues:**

1. Check troubleshooting guide: `references/troubleshooting-guide.md`
2. Run validation: `bash scripts/validate-pre-deployment.sh`
3. Check logs: `railway logs --service "AINative- Core -Production" | tail -100`
4. Check health: `curl https://ainative-browser-builder.up.railway.app/health`
5. Create issue: `gh issue create --title "[BUG] Deployment issue" --body "..."`

## License

Part of the AINative Studio core repository.
