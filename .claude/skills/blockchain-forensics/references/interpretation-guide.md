# Forensic Analysis Interpretation Guide

Quick reference for interpreting blockchain forensic analysis results and making actionable recommendations.

## Quick Decision Tree

```
Start
  │
  ├─ Confidence 8-10/10? ─── YES ──→ 🚨 HIGH RISK: Likely manipulation
  │                                   Action: Avoid/Flag/Investigate
  │
  ├─ Confidence 6-7/10? ──── YES ──→ ⚠️  MEDIUM RISK: Suspicious
  │                                   Action: Request explanation/Monitor
  │
  └─ Confidence 1-5/10? ──── YES ──→ ✅ LOW RISK: Appears healthy
                                      Action: Proceed with due diligence
```

## Confidence Score Interpretation

### 10/10 - Maximum Confidence Manipulation

**What it means:**
- ALL four detection algorithms triggered
- Perfect textbook wash trading pattern
- No room for alternative explanation

**Typical metrics:**
- Unique addresses: 2-3
- Concentration: >90%
- Alternation: >60%
- Timing ratio: <15%
- Loop pattern: YES

**Example:** Boom bNGN
- 2 addresses, 100% concentration, 72.92% alternation
- Verdict: Irrefutable wash trading

**Recommendation:**
- **Investors:** AVOID completely
- **Exchanges:** DELIST immediately
- **Regulators:** INVESTIGATE for fraud
- **Auditors:** FLAG in report as critical finding

**Sample Client Communication:**
> "Our analysis detected conclusive evidence of wash trading with maximum confidence (10/10). Only 2 wallets control 100% of activity, trading back and forth every 34 seconds. This token exhibits all four indicators of manipulation. We strongly recommend avoiding this token and flagging it for regulatory review."

---

### 9/10 - Very High Confidence

**What it means:**
- Three detection algorithms strongly triggered
- Very likely manipulation
- Minor uncertainty (e.g., slightly more addresses, but still suspicious)

**Typical metrics:**
- Unique addresses: 3-5
- Concentration: 70-90%
- Alternation: 40-60%
- Timing ratio: 15-25%
- Loop pattern: YES

**Recommendation:**
- **Investors:** AVOID
- **Exchanges:** FLAG for review, likely delist
- **Regulators:** Strong evidence for investigation
- **Auditors:** Critical finding with high certainty

**Sample Client Communication:**
> "Very high confidence (9/10) manipulation detected. While there are [X] addresses instead of just 2, the pattern shows [Y]% concentration and [Z]% alternation score. This is consistent with sophisticated wash trading using multiple wallets. Recommend treating as high-risk."

---

### 8/10 - High Confidence

**What it means:**
- Multiple strong indicators
- Likely wash trading or coordinated manipulation
- Some elements of sophistication (varied timing, more addresses)

**Typical metrics:**
- Unique addresses: 5-10
- Concentration: 60-70%
- Alternation: 25-40%
- Timing ratio: 20-30%
- Loop pattern: Possible

**Recommendation:**
- **Investors:** High caution, avoid unless explained
- **Exchanges:** Request explanation from team
- **Regulators:** Warrants investigation
- **Auditors:** Major finding requiring response

**Sample Client Communication:**
> "High confidence (8/10) suspicious activity detected. The token shows [key metrics]. While more sophisticated than basic wash trading, the pattern is consistent with coordinated manipulation. Recommend requesting detailed explanation from the project team before proceeding."

---

### 7/10 - Moderately High Confidence

**What it means:**
- Could be market making OR manipulation
- Needs additional context
- Professional trading patterns detected

**Typical metrics:**
- Unique addresses: 10-20
- Concentration: 50-60%
- Alternation: 18-25%
- Timing ratio: 25-35%

**Recommendation:**
- **Investors:** Proceed with caution
- **Exchanges:** Request documentation of market making
- **Regulators:** Monitor but not urgent
- **Auditors:** Flag as observation requiring clarification

**Sample Client Communication:**
> "Moderately high confidence (7/10) of coordinated activity. This pattern is consistent with either professional market making or manipulation. We recommend: (1) Request information about market makers from the team, (2) Verify any claimed partnerships with exchanges/MMs, (3) Monitor for pattern changes before making final decision."

---

### 6/10 - Medium Confidence

**What it means:**
- Ambiguous signals
- Could be legitimate market making
- Could be early-stage token with few users
- Requires investigation

**Typical metrics:**
- Unique addresses: 15-30
- Concentration: 40-55%
- Alternation: 12-20%
- Timing ratio: 30-40%

**Recommendation:**
- **Investors:** Normal due diligence with extra scrutiny
- **Exchanges:** Standard listing review
- **Regulators:** Note but don't prioritize
- **Auditors:** Mention as observation

**Sample Client Communication:**
> "Medium confidence (6/10) signals detected. The metrics show [X]. This could indicate: (A) Professional market making - verify with team, (B) Early-stage token with limited users - check launch date, or (C) Initial liquidity provision - normal for new tokens. Recommend gathering additional context before making determination."

---

### 4-5/10 - Low-Medium Confidence

**What it means:**
- Mostly normal with minor concerns
- Likely false positive or edge case
- No significant red flags

**Typical metrics:**
- Unique addresses: 30-50
- Concentration: 30-45%
- Alternation: 8-15%
- Timing ratio: >40%

**Recommendation:**
- **Investors:** Proceed normally
- **Exchanges:** Standard approval process
- **Regulators:** No action needed
- **Auditors:** May mention for completeness

**Sample Client Communication:**
> "Low-medium confidence (4/10) with minor observations. The token shows mostly healthy patterns with [X] unique participants and [Y]% concentration. The slight elevation in [metric] is within normal range for [context]. No significant concerns detected. Recommend proceeding with standard due diligence."

---

### 1-3/10 - Low Confidence (Healthy)

**What it means:**
- Organic, diverse trading
- No manipulation detected
- Healthy token metrics

**Typical metrics:**
- Unique addresses: >50
- Concentration: <30%
- Alternation: <10%
- Timing ratio: >50%

**Recommendation:**
- **Investors:** Positive signal
- **Exchanges:** Healthy listing candidate
- **Regulators:** No concerns
- **Auditors:** Positive finding

**Sample Client Communication:**
> "Low confidence (2/10) of manipulation - this is a positive result. The token shows healthy trading patterns with [X] unique participants, low concentration ([Y]%), and diverse timing patterns. Alternation score of [Z]% is well within organic trading range. Token appears to have legitimate market activity. Recommend proceeding with confidence."

---

## Metric-Specific Interpretation

### Unique Addresses

| Count | Status | Interpretation |
|-------|--------|----------------|
| 1-2 | 🚨 CRITICAL | Perfect wash trading |
| 3-5 | 🚨 HIGH RISK | Coordinated group |
| 6-10 | ⚠️ CAUTION | Limited participation |
| 11-20 | ⚠️ WATCH | Small but growing |
| 21-50 | ✅ NORMAL | Early stage token |
| 51-100 | ✅ HEALTHY | Good distribution |
| >100 | ✅ EXCELLENT | Mature, diverse |

**Context matters:**
- New token (< 1 month): 10-20 addresses may be normal
- Established token (> 6 months): Expect 50+ addresses
- High-volume token: Should have 100+ addresses

### Concentration (Top 2)

| Percentage | Status | Interpretation |
|------------|--------|----------------|
| 90-100% | 🚨 CRITICAL | Wash trading |
| 70-90% | 🚨 HIGH RISK | Extreme control |
| 60-70% | ⚠️ CAUTION | Very concentrated |
| 50-60% | ⚠️ WATCH | Whale presence |
| 30-50% | ✅ NORMAL | Moderate |
| <30% | ✅ HEALTHY | Decentralized |

**Questions to ask:**
- Are top addresses DEX pools? (Legitimate)
- Are they exchange hot wallets? (Legitimate)
- Are they known market makers? (Verify)
- Are they unknown EOAs? (Suspicious)

### Alternation Score

| Score | Status | Interpretation |
|-------|--------|----------------|
| >60% | 🚨 CRITICAL | Extreme wash trading |
| 40-60% | 🚨 HIGH RISK | Very suspicious |
| 25-40% | ⚠️ CAUTION | Likely coordinated |
| 15-25% | ⚠️ WATCH | Possible market making |
| 10-15% | ✅ NORMAL | Normal MM activity |
| <10% | ✅ HEALTHY | Organic trading |

**Edge cases:**
- P2P platform: May have legitimate high alternation
- OTC desk: Professional trading may show patterns
- DEX arbitrage: Bots create some alternation

### Timing Regularity Ratio

| Ratio | Status | Interpretation |
|-------|--------|----------------|
| <10% | 🚨 CRITICAL | Perfect bot timing |
| 10-20% | 🚨 HIGH RISK | Bot-like automation |
| 20-30% | ⚠️ CAUTION | Regular patterns |
| 30-50% | ⚠️ WATCH | Some automation |
| 50-70% | ✅ NORMAL | Mixed human/bot |
| >70% | ✅ HEALTHY | Human variance |

**Context:**
- High-frequency trading: Low ratio is normal
- Retail trading: High ratio expected
- Market making bots: 20-40% is professional

---

## Common Scenarios

### Scenario 1: New Token Launch

**Metrics:**
- Unique addresses: 8
- Concentration: 75%
- Alternation: 12%
- Timing: 45%
- Confidence: 6/10

**Analysis:**
New tokens often have high concentration initially. Low alternation is positive. Medium confidence is appropriate.

**Questions:**
1. How old is the token? (< 1 week = expected)
2. Is team address one of top 2? (Expected for treasury)
3. Is there a public sale happening? (Would explain concentration)
4. What's the project's stated go-to-market plan?

**Recommendation:**
If < 2 weeks old and team can explain, re-analyze in 30 days. If > 1 month old with these metrics, red flag.

---

### Scenario 2: DEX Liquidity Pool Token

**Metrics:**
- Unique addresses: 45
- Concentration: 62% (top address is Uniswap pool)
- Alternation: 8%
- Timing: 65%
- Confidence: 5/10

**Analysis:**
High concentration explained by DEX pool is legitimate. Low alternation and irregular timing are positive signals.

**Key check:**
Verify top address is actually a known DEX pool contract:
```bash
# Check if contract
eth_getCode(address) != "0x"

# Look up on Etherscan/explorer
# Should show "Contract" badge and verified source
```

**Recommendation:**
If top address is verified DEX pool, this is healthy. Exclude pool address and re-analyze.

---

### Scenario 3: Stablecoin or Wrapped Asset

**Metrics:**
- Unique addresses: 200+
- Concentration: 35%
- Alternation: 15%
- Timing: 40%
- Confidence: 4/10

**Analysis:**
Stablecoins often show different patterns. Arbitrage bots create some alternation. Medium timing regularity is normal.

**Context:**
- USDC, USDT, DAI: Expect high activity, moderate patterns
- Wrapped BTC/ETH: Similar profile
- Algorithmic stables: May show more bot activity

**Recommendation:**
For stablecoins and wrapped assets, adjust thresholds:
- Alternation < 20% is acceptable
- Timing ratio < 40% is acceptable
- Focus more on unusual spikes or isolated loops

---

### Scenario 4: Governance Token (Low Volume)

**Metrics:**
- Unique addresses: 12
- Concentration: 55%
- Alternation: 6%
- Timing: 95%
- Confidence: 3/10

**Analysis:**
Governance tokens may have sporadic trading. High timing variance (95%) indicates human/event-driven activity. Low alternation is positive.

**Key check:**
- Are transfers correlated with governance votes?
- Are they periodic (monthly/quarterly) rather than daily?
- Do addresses correlate with known DAO members?

**Recommendation:**
Low volume governance tokens need different analysis. Focus on:
- Are there governance proposals matching transfer dates?
- Is concentration among known community members?
- Are transfers large (governance) or small (trading)?

---

## Red Flags Requiring Immediate Action

### 🚨 Critical Red Flags (Stop immediately)

1. **Perfect 2-address loop**
   - Only 2 addresses
   - 100% concentration
   - >50% alternation
   - Action: REJECT, flag for fraud

2. **Bot timing with high volume**
   - Timing ratio < 15%
   - Volume > $1M
   - >40% alternation
   - Action: Report to exchange/regulators

3. **Sudden pattern change**
   - Was organic (2/10), now wash trading (9/10)
   - Indicates coordinated pump attempt
   - Action: Alert users, investigate

4. **Zero organic addresses**
   - All addresses are bots or coordinated
   - No real users detectable
   - Action: Classify as scam

### ⚠️ Yellow Flags (Investigate further)

1. **High concentration with unknown addresses**
   - Top 2 are EOAs (not contracts)
   - Not known market makers
   - Not team addresses
   - Action: Request explanation

2. **Rising alternation over time**
   - Was 5%, now 15%, now 22%
   - Indicates emerging coordination
   - Action: Monitor closely, warn

3. **Timing patterns during specific hours**
   - Bot activity only during certain timezones
   - Suggests single operator
   - Action: Note in report, investigate

4. **Volume spikes with no news**
   - Sudden 10x volume increase
   - No announcements or events
   - High alternation during spike
   - Action: Possible pump, investigate

---

## When to Request Additional Information

**Always request explanation when:**
1. Confidence 7-8/10 (ambiguous range)
2. High concentration (>60%) but low alternation (<15%)
3. Metrics don't align (high concentration, low alternation, bot timing)
4. Known market maker claimed but not verified
5. Pattern changed significantly from previous analysis

**Questions to ask project team:**
1. "Who are your market makers? Can you provide contracts/agreements?"
2. "Can you explain the high concentration in addresses 0xABC and 0xDEF?"
3. "Why does activity show regular 30-second intervals?"
4. "Are you conducting tests on mainnet? If so, why?"
5. "Have you reviewed your token activity for manipulation?"

**Red flags in responses:**
- Evasive answers
- No documentation provided
- Blaming "organic users"
- Claiming "we don't control it"
- Attacking the analysis methodology

---

## Documentation Templates

### High Confidence Finding

```markdown
## Forensic Analysis: [TOKEN NAME]

**Summary:** High confidence (9/10) wash trading detected.

**Evidence:**
- Unique addresses: 3 (CRITICAL - only 3 wallets)
- Concentration: 87% (EXTREME - top 2 control 87%)
- Alternation: 45% (HIGH - nearly half of transfers loop)
- Timing: 18% regularity ratio (BOT-LIKE)
- Loop pattern: DETECTED

**Interpretation:**
Three wallets are coordinating to artificially inflate volume through
back-and-forth trading. Pattern is consistent with wash trading to
create appearance of activity. Bot timing indicates automation.

**Recommendation:**
REJECT for listing. Flag for compliance review. Avoid for investment.

**Next Steps:**
1. Document finding in [ticket/case number]
2. Notify relevant stakeholders
3. Add token to watchlist
4. Monitor for regulatory action
```

### Medium Confidence Finding

```markdown
## Forensic Analysis: [TOKEN NAME]

**Summary:** Medium confidence (6/10) requiring investigation.

**Observations:**
- Unique addresses: 18 (LOW - limited participation)
- Concentration: 58% (MODERATE - approaching threshold)
- Alternation: 14% (NORMAL - within acceptable range)
- Timing: 42% regularity ratio (NORMAL)

**Possible Explanations:**
1. Early-stage token with limited adoption
2. Professional market making activity
3. Initial liquidity bootstrapping phase

**Recommendation:**
Request clarification from project team before proceeding.

**Questions for Team:**
1. Token age and launch date?
2. Market making arrangements?
3. Expected user growth trajectory?

**Next Steps:**
1. Send questions to project team
2. Re-analyze in 30 days
3. Compare with similar early-stage tokens
4. Verify any claimed partnerships
```

---

**Last Updated:** 2026-03-03
**Version:** 1.0
**For:** Client-facing analysis and internal decision making
