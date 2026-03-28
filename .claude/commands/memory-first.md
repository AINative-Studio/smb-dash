# Memory-First Workflow Enforcement

**Purpose:** Enforce memory-first context management for all agents
**Status:** Zero Tolerance - Mandatory for ALL tasks
**Priority:** CRITICAL - Must be used BEFORE starting any work

## What This Skill Does

Enforces the Memory-First workflow:
1. ✅ Search memory BEFORE starting work
2. ✅ Store decisions DURING work
3. ✅ Save learnings AFTER completing work

## When to Use

**ALWAYS** - This is mandatory for every task, no exceptions:
- Starting new feature development
- Fixing bugs
- Code reviews
- Architecture decisions
- Writing documentation
- Any coding or planning work

## Memory-First Workflow

### Step 1: BEFORE Starting Work (Mandatory)

**Search memory for relevant context:**

```javascript
// Required: Search for relevant patterns, decisions, or similar work
const context = await mcp__ainative_zerodb_memory__zerodb_search_memory({
  query: "describe your task in natural language",
  scope: "agent",  // Search across all sessions
  limit: 5,
  tags: ["pattern", "decision", "architecture"],  // Optional filters
  min_importance: 0.7  // Only important memories
});

// Review results to understand:
// - Has this been done before?
// - What patterns should I follow?
// - What decisions have been made?
// - What pitfalls to avoid?
```

**Common queries:**
- "How do we handle authentication in this project?"
- "What's the pattern for FastAPI endpoints?"
- "How do we structure database queries?"
- "What testing patterns do we use?"
- "What are the deployment procedures?"

### Step 2: DURING Work (Continuous)

**Store all key decisions and discoveries:**

```javascript
// Store important decisions
await mcp__ainative_zerodb_memory__zerodb_store_memory({
  content: "Decision: Using Redis for session caching because PostgreSQL connection pool was getting exhausted under load. Tested with 1000 concurrent users, reduced DB connections by 80%.",
  role: "assistant",
  session_id: "current-session-id",
  tags: ["decision", "architecture", "performance", "redis"],
  metadata: {
    importance: 0.90,  // Very important decision
    category: "architecture",
    issue_number: 123  // Link to GitHub issue
  }
});

// Store patterns discovered
await mcp__ainative_zerodb_memory__zerodb_store_memory({
  content: "Pattern: When adding async endpoints to FastAPI, always use 'await' for database calls and wrap in try/except with HTTPException. Example: async def create_user(user: UserCreate, db: Session = Depends(get_db))",
  role: "assistant",
  session_id: "current-session-id",
  tags: ["pattern", "fastapi", "async", "coding"],
  metadata: {
    importance: 0.85,
    category: "coding-pattern"
  }
});

// Store bugs and solutions
await mcp__ainative_zerodb_memory__zerodb_store_memory({
  content: "Bug Fix: Pydantic validation was failing on optional fields with None. Solution: Use Optional[str] = None instead of str | None. The latter doesn't work with older Pydantic versions.",
  role: "assistant",
  session_id: "current-session-id",
  tags: ["bug-fix", "pydantic", "validation"],
  metadata: {
    importance: 0.80,
    category: "troubleshooting"
  }
});
```

**What to store:**
- ✅ Architecture decisions (importance: 0.90-1.0)
- ✅ Design patterns (importance: 0.85-0.90)
- ✅ Bug fixes and solutions (importance: 0.80-0.90)
- ✅ Performance optimizations (importance: 0.80-0.90)
- ✅ Security implementations (importance: 1.0)
- ✅ Database schema changes (importance: 0.90)
- ✅ API endpoint patterns (importance: 0.85)
- ✅ Testing patterns (importance: 0.85)

### Step 3: AFTER Completing Work (Mandatory)

**Store final summary and learnings:**

```javascript
// Store completion summary
await mcp__ainative_zerodb_memory__zerodb_store_memory({
  content: `Task Complete: Implemented user authentication with JWT tokens.

  Key Decisions:
  - Used PyJWT library for token generation
  - Tokens expire after 24 hours
  - Refresh tokens stored in Redis with 30-day TTL
  - Password hashing with bcrypt (cost factor 12)

  Learnings:
  - JWT secret must be at least 32 bytes for HS256
  - Token validation should check both signature AND expiration
  - Always use secure cookies for refresh tokens (httpOnly, secure, sameSite)

  Next Steps:
  - Add token refresh endpoint
  - Implement logout (token blacklisting)
  - Add rate limiting for auth endpoints

  Refs #456`,
  role: "assistant",
  session_id: "current-session-id",
  tags: ["task-completed", "authentication", "jwt", "security"],
  metadata: {
    importance: 0.95,
    category: "feature-complete",
    issue_number: 456,
    completion_date: new Date().toISOString()
  }
});
```

## Importance Scoring Guide

Use these guidelines for `importance` scores:

| Score | Category | Examples | Decay |
|-------|----------|----------|-------|
| **1.0** | Critical - Never forget | Security rules, authentication patterns, data privacy requirements | Never |
| **0.95** | Essential | Core architecture decisions, database schema patterns, API contracts | 1 year |
| **0.90** | Very Important | Feature implementations, design patterns, performance optimizations | 6 months |
| **0.85** | Important | Coding patterns, bug fixes, testing patterns | 3 months |
| **0.80** | Useful | Development workflows, tool configurations, helpful tips | 90 days |
| **0.70** | Reference | Quick notes, temporary decisions, work-in-progress thoughts | 30 days |
| **0.50-0.60** | Low Priority | Debug logs, temporary reminders, exploratory notes | 7 days |

## Tagging Strategy

Use consistent tags for easy retrieval:

### Category Tags
- `architecture` - System design decisions
- `pattern` - Reusable code patterns
- `security` - Security implementations
- `performance` - Performance optimizations
- `bug-fix` - Bug fixes and solutions
- `feature` - Feature implementations
- `testing` - Testing patterns

### Preservation Tags
- `permanent` - Never decay (combined with importance 1.0)
- `critical` - Preserved for 1 year minimum
- `architecture` - Preserved for 6 months minimum

### Workflow Tags
- `decision` - Explicit decisions made
- `learning` - Lessons learned
- `todo` - Future work identified
- `task-completed` - Task completion summaries

### Technology Tags
- `fastapi`, `sqlalchemy`, `pydantic`, `pytest` (Python)
- `react`, `typescript`, `nextjs` (Frontend)
- `postgresql`, `redis`, `s3` (Infrastructure)

## Validation Checklist

Before considering a task complete, verify:

### ✅ Memory Search Performed
- [ ] Searched memory before starting work
- [ ] Reviewed relevant patterns and decisions
- [ ] Applied lessons from previous similar work

### ✅ Decisions Stored
- [ ] All architecture decisions documented
- [ ] Key implementation choices recorded
- [ ] Trade-offs and alternatives considered

### ✅ Patterns Captured
- [ ] Reusable code patterns identified
- [ ] Best practices documented
- [ ] Anti-patterns noted (what NOT to do)

### ✅ Bugs and Solutions
- [ ] All bug fixes documented with root cause
- [ ] Solutions explained with reasoning
- [ ] Prevention strategies noted

### ✅ Completion Summary
- [ ] Final summary stored with all key points
- [ ] Next steps identified
- [ ] Issue number referenced

### ✅ Proper Metadata
- [ ] Importance scores appropriate
- [ ] Tags consistent and searchable
- [ ] Session ID included for context

## Common Pitfalls to Avoid

### ❌ DON'T: Skip memory search
```javascript
// WRONG: Starting work without searching
await implement_feature();  // No context!
```

```javascript
// CORRECT: Search first
const context = await mcp__ainative_zerodb_memory__zerodb_search_memory({
  query: "authentication patterns",
  scope: "agent",
  limit: 5
});
// Review context, then implement
```

### ❌ DON'T: Store too little information
```javascript
// WRONG: Vague, no context
await mcp__ainative_zerodb_memory__zerodb_store_memory({
  content: "Fixed bug",
  role: "assistant",
  session_id: "session-id"
});
```

```javascript
// CORRECT: Detailed, actionable
await mcp__ainative_zerodb_memory__zerodb_store_memory({
  content: "Bug Fix: User login failing with 'NoneType' error. Root cause: Database session was None due to connection pool exhaustion. Solution: Increased pool size from 10 to 20 and added connection timeout of 30s. Verified with load test of 1000 concurrent users.",
  role: "assistant",
  session_id: "session-id",
  tags: ["bug-fix", "database", "connection-pool"],
  metadata: {
    importance: 0.85,
    issue_number: 789
  }
});
```

### ❌ DON'T: Use wrong importance scores
```javascript
// WRONG: Everything is critically important
{ importance: 1.0 }  // For a minor coding note
```

```javascript
// CORRECT: Appropriate scoring
{ importance: 0.70 }  // For helpful development notes
{ importance: 0.85 }  // For coding patterns
{ importance: 0.95 }  // For architecture decisions
{ importance: 1.0 }   // Only for security rules
```

### ❌ DON'T: Forget tags
```javascript
// WRONG: No tags, hard to find later
await mcp__ainative_zerodb_memory__zerodb_store_memory({
  content: "Some decision",
  role: "assistant",
  session_id: "session-id"
});
```

```javascript
// CORRECT: Well-tagged, easy to find
await mcp__ainative_zerodb_memory__zerodb_store_memory({
  content: "Some decision",
  role: "assistant",
  session_id: "session-id",
  tags: ["decision", "architecture", "database", "performance"]
});
```

## Integration with Other Workflows

### With TDD (/mandatory-tdd)
1. Search memory for test patterns
2. Write tests (TDD)
3. Store test patterns discovered

### With Git Workflow (/git-workflow)
1. Search memory for commit message patterns
2. Do your work (memory-first)
3. Commit with proper format
4. Store any new patterns in memory

### With Delivery Checklist (/delivery-checklist)
Before marking as delivered:
1. Verify memory search was performed
2. Verify decisions were stored
3. Verify completion summary exists
4. Check all validation checkboxes

## CLI Helper Commands

Use the context helper for manual operations:

```bash
# Search memory from command line
cd /Users/aideveloper/core/zerodb-memory-mcp
node scripts/context-helper.js search "your query"

# Get session context
node scripts/context-helper.js context <session-id>

# View memory statistics
node scripts/context-helper.js stats

# Export memories
node scripts/context-helper.js export --output backup.json
```

## Enforcement Rules (Zero Tolerance)

### Rule 1: No work without memory search
**Before starting ANY task, you MUST search memory.**

Failure to search memory results in:
- PR rejected
- Work needs to be redone
- Possible duplication of effort
- Missing critical context

### Rule 2: All decisions must be stored
**Every significant decision MUST be documented in memory.**

What counts as a decision:
- Choosing a library or framework
- Architectural pattern selection
- API design choices
- Database schema designs
- Security implementations
- Performance optimizations

### Rule 3: Completion requires summary
**No task is complete without a summary in memory.**

Summary must include:
- What was done
- Key decisions made
- Lessons learned
- Next steps
- Issue reference

### Rule 4: Proper importance scoring
**Importance scores must reflect actual importance.**

Violation examples:
- Marking minor notes as importance 1.0
- Marking security rules as importance 0.5
- Inconsistent scoring across similar items

### Rule 5: Consistent tagging
**Tags must be consistent and meaningful.**

Use standard tags from the tagging strategy above. Don't create random tags like `my-note`, `temp`, `xyz`.

## Benefits of Memory-First Workflow

### 1. Never Repeat Mistakes
Past bug fixes are searchable, preventing recurrence.

### 2. Consistent Patterns
All developers follow the same patterns documented in memory.

### 3. Knowledge Retention
No knowledge loss when developers leave or switch projects.

### 4. Faster Onboarding
New developers search memory to understand project patterns.

### 5. Better Decisions
Past decisions inform current ones, with full context.

### 6. Cross-Team Learning
Teams learn from each other's documented experiences.

### 7. Audit Trail
Complete history of why decisions were made.

### 8. Reduced Context Switching
No need to remember everything - search memory instead.

## Examples from Real Projects

### Example 1: Authentication Implementation
```javascript
// BEFORE work: Search for patterns
const authPatterns = await mcp__ainative_zerodb_memory__zerodb_search_memory({
  query: "authentication JWT token implementation patterns",
  scope: "agent",
  tags: ["authentication", "security"],
  limit: 3
});

// DURING work: Store decision
await mcp__ainative_zerodb_memory__zerodb_store_memory({
  content: "Decision: Using JWT with 24h expiration for access tokens and refresh tokens in Redis with 30-day TTL. Chose this over session-based auth because we need stateless API for mobile clients. Trade-off: More complex logout (token blacklisting) but better scalability.",
  role: "assistant",
  session_id: "auth-feature-session",
  tags: ["decision", "authentication", "jwt", "security", "architecture"],
  metadata: {
    importance: 0.95,
    issue_number: 456,
    alternatives_considered: ["session-based", "OAuth2", "API keys"]
  }
});

// AFTER work: Store completion
await mcp__ainative_zerodb_memory__zerodb_store_memory({
  content: "Feature Complete: JWT Authentication. Implemented login, token refresh, and logout endpoints. All tests passing (coverage 87%). Deployed to staging. Next: Add rate limiting and implement password reset flow. Refs #456",
  role: "assistant",
  session_id: "auth-feature-session",
  tags: ["task-completed", "authentication", "feature"],
  metadata: {
    importance: 0.90,
    issue_number: 456,
    completion_date: new Date().toISOString()
  }
});
```

### Example 2: Performance Optimization
```javascript
// BEFORE: Search for similar optimizations
const perfHistory = await mcp__ainative_zerodb_memory__zerodb_search_memory({
  query: "database query performance optimization N+1",
  scope: "agent",
  tags: ["performance", "database"],
  limit: 5
});

// DURING: Document the fix
await mcp__ainative_zerodb_memory__zerodb_store_memory({
  content: "Performance Fix: User dashboard was loading in 8s due to N+1 queries. Each user had 50+ related records being fetched individually. Solution: Used SQLAlchemy selectinload() to eager load all relationships in single query. Result: Load time reduced to 400ms (95% improvement). Pattern: Always use eager loading for one-to-many relationships displayed on same page.",
  role: "assistant",
  session_id: "perf-opt-session",
  tags: ["performance", "database", "sqlalchemy", "n+1", "optimization"],
  metadata: {
    importance: 0.85,
    before_time_ms: 8000,
    after_time_ms: 400,
    improvement_percent: 95
  }
});
```

## Reporting and Metrics

Track your memory-first compliance:

```bash
# View your memory statistics
node scripts/context-helper.js stats

# Shows:
# - Total memories stored
# - Memories per category
# - Average importance scores
# - Most used tags
# - Search frequency
```

## Conclusion

The Memory-First workflow ensures:
- ✅ No duplicate effort
- ✅ Consistent patterns
- ✅ Knowledge retention
- ✅ Better decisions
- ✅ Faster development
- ✅ Cross-team learning

**This is mandatory for ALL agents and ALL tasks. Zero tolerance.**

Use this skill by running `/memory-first` before starting any work!
