# Railway Deployment - Quick Command Reference

## Pre-Deployment

### Validation
```bash
# Run complete pre-deployment validation
bash scripts/validate-pre-deployment.sh

# Run tests with coverage
cd src/backend && python3 -m pytest tests/ -v --cov=app --cov-report=term-missing

# Check database pool
python3 scripts/check_db_connection_pool.py

# Schema sync dry-run
python3 scripts/sync-production-schema.py --dry-run
```

### Code Quality
```bash
# Lint Python code
cd src/backend && flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics

# Format Python code
cd src/backend && black .

# Check imports
cd src/backend && isort --check-only --profile black .
```

### Git Validation
```bash
# Check for AI attribution in last commit
git log -1 --pretty=%B | grep -iE "(claude|anthropic|generated with|co-authored-by: claude)"

# Check branch name
git rev-parse --abbrev-ref HEAD

# Check issue assignment
gh issue view <issue-number> | grep "assignees:"
```

## Deployment

### Quick Deploy
```bash
# Full deployment with validation
bash scripts/railway-deploy.sh

# Dry-run (validation only, no push)
bash scripts/railway-deploy.sh --dry-run

# Skip tests (not recommended)
bash scripts/railway-deploy.sh --skip-tests

# With custom message
bash scripts/railway-deploy.sh --message "[FEATURE] Add new endpoint - Refs #123"
```

### Manual Deploy
```bash
# Stage and commit
git add .
git commit -m "[TYPE] Description - Refs #<issue>"

# Push to trigger deployment
git push origin main
```

## Monitoring

### Railway Logs
```bash
# Follow logs in real-time
railway logs --service "AINative- Core -Production" --follow

# Last 100 lines
railway logs --service "AINative- Core -Production" | tail -100

# Search logs
railway logs --service "AINative- Core -Production" | grep ERROR

# Kong logs
railway logs --service kong-gateway | tail -100
```

### Service Status
```bash
# Check Railway service status
railway status --service "AINative- Core -Production"

# Check all services
railway status
```

### Health Checks
```bash
# Backend health
curl -s https://ainative-browser-builder.up.railway.app/health | jq .

# Kong gateway health
curl -I https://api.ainative.studio/health

# Extract Kong headers
curl -I https://api.ainative.studio/health | grep -E "(via|x-kong)"
```

## Debugging

### Connection Issues
```bash
# Test backend directly
curl -s https://ainative-browser-builder.up.railway.app/health

# Test through Kong
curl -s https://api.ainative.studio/health

# Check database connections
python3 scripts/check_db_connection_pool.py

# Kill dev servers (if pool exhausted)
pkill -9 -f "npm run dev"
pkill -9 -f "python.*uvicorn"
sleep 30
```

### Database
```bash
# Connect to production database
psql $DATABASE_URL

# List tables
psql $DATABASE_URL -c "\dt"

# Describe table
psql $DATABASE_URL -c "\d table_name"

# Check migrations
psql $DATABASE_URL -c "SELECT * FROM alembic_version;"
```

### Kong Configuration
```bash
# View Kong config
cat kong/config/kong.yml

# Check upstream URL
cat kong/config/kong.yml | grep -A5 "url:"

# Must show: https://ainative-browser-builder.up.railway.app
```

## Rollback

### Immediate Rollback
```bash
# Revert last commit
git revert HEAD
git push origin main

# Revert specific commit
git revert <commit-sha>
git push origin main
```

### Railway Dashboard Rollback
```
1. Go to Railway dashboard
2. Select "AINative- Core -Production"
3. Go to "Deployments"
4. Select previous successful deployment
5. Click "Redeploy"
```

## Pull Requests

### Create PR
```bash
# Create PR with template
gh pr create --title "[TYPE] Description - Fixes #<issue>" --body "$(cat <<'EOF'
## Summary
- What changed
- Why it changed

## Test Plan
```bash
pytest tests/test_feature.py -v
```

## Verification
- [ ] Tests passing
- [ ] Health check verified
- [ ] No secrets in code

Fixes #<issue>
EOF
)"
```

### Check PR Status
```bash
# View PR
gh pr view

# Check CI status
gh pr checks

# Merge PR
gh pr merge --squash
```

## Environment Variables

### View Variables (Railway Dashboard)
```
1. Go to Railway dashboard
2. Select service
3. Click "Variables" tab
4. View/edit environment variables
```

### Required Variables
- `PORT` - Auto-set by Railway
- `DATABASE_URL` - Auto-set when PostgreSQL added
- `SECRET_KEY` - Set manually
- `BACKEND_CORS_ORIGINS` - Set to allowed origins

## Testing

### Backend Tests
```bash
# Run all tests
cd src/backend && pytest tests/ -v

# Run specific test file
cd src/backend && pytest tests/test_auth.py -v

# Run with coverage
cd src/backend && pytest tests/ -v --cov=app --cov-report=term-missing

# Run parallel
cd src/backend && pytest tests/ -n auto
```

### Integration Tests
```bash
# Test API endpoints
cd src/backend && pytest tests/api/ -v

# Test database operations
cd src/backend && pytest tests/db/ -v
```

## Database Operations

### Schema Management
```bash
# Dry-run schema sync
python3 scripts/sync-production-schema.py --dry-run

# Apply schema changes
python3 scripts/sync-production-schema.py --apply

# Create Alembic migration (for documentation)
cd src/backend && alembic revision --autogenerate -m "Description"

# DO NOT run in production
# alembic upgrade head  # Use schema sync instead
```

### Data Operations
```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql

# Export specific table
pg_dump $DATABASE_URL -t table_name > table_backup.sql
```

## Performance Monitoring

### Check Response Times
```bash
# Backend response time
time curl -s https://ainative-browser-builder.up.railway.app/health

# Kong response time
time curl -s https://api.ainative.studio/health
```

### Check Resource Usage
```
# View in Railway dashboard:
1. Select service
2. View "Metrics" tab
3. Check CPU, Memory, Network usage
```

## Common Issues

### Issue: DNS Resolution Failed
```bash
# Check Kong upstream URL
cat kong/config/kong.yml | grep -A5 "url:"
# Must be: https://ainative-browser-builder.up.railway.app
```

### Issue: QueuePool Limit Reached
```bash
# Check pool status
python3 scripts/check_db_connection_pool.py

# Fix: Kill dev servers
pkill -9 -f "npm run dev"
sleep 30
```

### Issue: 502/503 from Kong
```bash
# Check backend first
curl -s https://ainative-browser-builder.up.railway.app/health

# If backend down, check logs
railway logs --service "AINative- Core -Production" | tail -100
```

### Issue: Tests Failing
```bash
# Run tests locally with same environment
cd src/backend
export DATABASE_URL="postgresql://postgres:postgres@localhost/cody_test"
pytest tests/ -v

# Check Python version matches CI
python --version  # Should be 3.12
```

## File Management

### File Placement Rules
```bash
# Documentation files
docs/{category}/filename.md

# Scripts
scripts/filename.sh

# Backend code
src/backend/app/...

# Root .md files (only these allowed)
README.md
CLAUDE.md
```

### Check File Placement
```bash
# Check for violations
git diff --cached --name-only | grep -E '^\w+\.md$|^src/backend/\w+\.md$|^src/backend/\w+\.sh$'

# Should return no results
```

## Git Workflow

### Branch Management
```bash
# Create branch
git checkout -b feature/123-description

# Branch naming convention
# [type]/[issue-number]-[slug]
# Types: feature, bug, test, refactor, docs, devops
```

### Commit Guidelines
```bash
# Good commit format
git commit -m "[TYPE] Brief description - Refs #<issue>

- Implementation detail 1
- Implementation detail 2

Refs #<issue>"

# Types: [BUG], [FEATURE], [TEST], [REFACTOR], [DOCS], [DEVOPS]
```

### Git Hooks
```bash
# Hooks automatically run:
# pre-commit: File placement validation
# pre-push: Pre-deployment validation (on main only)

# Bypass hooks (NOT RECOMMENDED)
git commit --no-verify
git push --no-verify
```

## Useful Aliases

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Railway aliases
alias rl='railway logs --service "AINative- Core -Production"'
alias rlf='railway logs --service "AINative- Core -Production" --follow'
alias rs='railway status'
alias rd='bash scripts/railway-deploy.sh'
alias rdd='bash scripts/railway-deploy.sh --dry-run'

# Testing aliases
alias pt='cd src/backend && pytest tests/ -v'
alias ptc='cd src/backend && pytest tests/ -v --cov=app --cov-report=term-missing'

# Validation aliases
alias validate='bash scripts/validate-pre-deployment.sh'
alias checkpool='python3 scripts/check_db_connection_pool.py'
alias checksync='python3 scripts/sync-production-schema.py --dry-run'

# Health check aliases
alias healthbe='curl -s https://ainative-browser-builder.up.railway.app/health | jq .'
alias healthkg='curl -I https://api.ainative.studio/health | grep -E "(HTTP|via|x-kong)"'
```
