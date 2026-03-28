# Blockchain Forensics Skill

**Type:** Project Skill
**Category:** Security & Analysis
**Status:** Active

## Purpose

Perform automated forensic analysis of blockchain token activity to detect wash trading, bot manipulation, and market fraud. Uses multi-metric detection algorithms to analyze trading patterns on any EVM-compatible blockchain with Blockscout-style explorers.

## When to Use This Skill

Use this skill when:

1. **Due Diligence** - Client wants to verify token legitimacy before integration
2. **Security Audit** - Investigating suspicious trading activity
3. **Market Surveillance** - Monitoring for manipulation patterns
4. **Token Launch Analysis** - Checking if new token has organic activity
5. **Compliance Investigation** - Generating evidence reports for regulators
6. **Investor Protection** - Analyzing token before recommending to clients
7. **Exchange Listing Review** - Validating token metrics for listing decisions

## Quick Start

```bash
# Analyze bNGN on Boom blockchain (default)
/blockchain-forensics

# Analyze specific token
/blockchain-forensics --token 0xYourTokenAddress --blockchain boomscan

# Generate full report with HTML + graphs
/blockchain-forensics --token 0xToken --export-all

# Reproducible analysis (for compliance reports)
/blockchain-forensics --token 0xToken --seed 12345 --export-all
```

## Core Workflow

### Step 1: Initiate Analysis

```bash
# For clients - generate professional report
/blockchain-forensics --token <CONTRACT> --export-html --output-dir reports/client_name

# For internal investigation
/blockchain-forensics --token <CONTRACT> --limit 2000
```

### Step 2: Review Output

The skill generates:

1. **Terminal Report** - 7-section forensic analysis
   - Token-wide snapshot
   - Concentration metrics
   - Bot/loop indicators
   - Random address deep-dive
   - Router/contract identification
   - **Verdict with confidence score (1-10)**

2. **HTML Report** (optional) - Professional dashboard
   - Color-coded risk indicators
   - Interactive metrics tables
   - Visual histograms
   - Ready for stakeholder presentation

3. **CSV Export** (optional) - Raw data
   - `transfers.csv` - All transfer records
   - `analysis_summary.csv` - Metrics summary

4. **Network Graph** (optional) - Visual loop detection
   - Red edges = A↔B wash trading loops
   - Blue nodes = addresses
   - Edge thickness = transfer frequency

### Step 3: Interpret Results

#### Classification Types

**WASH-LIKE LOOPING** (Confidence: 8-10/10)
- **Indicators:** High alternation (>20%), extreme concentration (>60%), bot-like timing
- **Meaning:** Coordinated wash trading between few wallets
- **Action:** Flag for review, recommend avoiding, escalate to compliance

**MARKET-MAKING / LIQUIDITY BOOTSTRAPPING** (Confidence: 6-7/10)
- **Indicators:** Moderate concentration (30-60%), DEX router usage, some repeated sizing
- **Meaning:** Professional market making or initial liquidity provision
- **Action:** Monitor but may be legitimate, verify with team

**TEST AUTOMATION** (Confidence: 6-7/10)
- **Indicators:** Few counterparties (<5), very regular timing, round numbers
- **Meaning:** Development/testing activity, not malicious but not organic
- **Action:** Verify with development team, separate from production metrics

**ORGANIC MULTI-USER TRADING** (Confidence: 1-5/10)
- **Indicators:** Low concentration (<30%), diverse participants, irregular timing
- **Meaning:** Healthy, legitimate trading activity
- **Action:** Proceed with confidence, token appears healthy

### Step 4: Take Action Based on Findings

**For High Confidence Manipulation (8-10/10):**
```bash
# Generate evidence package for client
/blockchain-forensics --token <TOKEN> --seed 123 --export-all --output-dir evidence/case_001

# Files generated:
# - forensics_report.html (professional report)
# - transfers.csv (raw evidence)
# - analysis_summary.csv (metrics)
# - network_graph.png (visual proof)
# - ANALYSIS_RESULTS.md (detailed technical report)
```

**For Medium Confidence (6-7/10):**
- Request additional information from token team
- Expand analysis timeframe (`--limit 5000`)
- Monitor for pattern changes over time
- Compare with similar tokens in ecosystem

**For Low Confidence (1-5/10):**
- Proceed with normal due diligence
- Token appears healthy
- Consider periodic monitoring

## Detection Algorithms

The skill uses 4 independent detection algorithms:

### 1. Alternation Score (A↔B Loop Detection)

**Algorithm:**
```python
# Scans for A→B→A patterns within time windows
for 3-transfer sequences in 1-hour window:
    if from[0] == from[2] and to[0] == from[1]:
        alternations++
score = (alternations / total_sequences) * 100
```

**Thresholds:**
- <10% = Organic trading
- 10-20% = Normal market making
- 20-50% = Suspicious (possible wash trading)
- >50% = Extreme (confirmed wash trading pattern)

**Example from Boom bNGN:**
- Score: 72.92%
- Interpretation: Extreme wash trading (>50% threshold)

### 2. Concentration Analysis

**Algorithm:**
```python
# Measures address dominance
top_n_count = sum(top_n_addresses_transfer_count)
total_count = total_transfers * 2  # Count both from and to
concentration = top_n_count / total_count
```

**Thresholds:**
- <30% = Decentralized/healthy
- 30-60% = Moderate concentration (watch)
- 60-80% = High concentration (suspicious)
- >80% = Extreme concentration (likely manipulation)

**Example from Boom bNGN:**
- Top 2: 100%
- Interpretation: Perfect wash trading signature

### 3. Timing Regularity

**Algorithm:**
```python
# Measures timing consistency (bots have regular intervals)
deltas = [t[i+1].timestamp - t[i].timestamp for all transfers]
median = median(deltas)
stdev = stdev(deltas)
regularity_ratio = stdev / median
```

**Thresholds:**
- >50% = Human/irregular (healthy)
- 30-50% = Moderate regularity (market making)
- <30% = Bot-like (automated trading)
- <20% = Extreme automation (manipulation)

**Example from Boom bNGN:**
- Ratio: 14.7% (5s stdev / 34s median)
- Interpretation: Extreme bot automation

### 4. Loop Pattern Detection

**Algorithm:**
```python
# Identifies isolated counterparty relationships
counterparties = unique_addresses_interacted_with(address)
top_concentration = top_counterparty_count / total_interactions
is_loop = (len(counterparties) <= 3 and top_concentration > 0.7)
```

**Thresholds:**
- Many counterparties = Organic
- 5-10 counterparties = Market making
- 2-4 counterparties + high concentration = Loop pattern
- 1-2 counterparties + >80% concentration = Confirmed loop

**Example from Boom bNGN:**
- Counterparties: 1
- Concentration: 100%
- Interpretation: Perfect A↔B loop

## Command Options

```bash
/blockchain-forensics [OPTIONS]

Required (one of):
  --token ADDRESS           Token contract address to analyze
  --blockchain NAME         Blockchain/explorer name (default: boomscan)

Optional:
  --limit N                 Number of transfers to fetch (default: 1000)
  --seed N                  Random seed for reproducibility
  --export-csv              Generate CSV exports
  --export-html             Generate HTML report
  --export-graph            Generate network graph (requires networkx)
  --export-all              Enable all exports
  --output-dir PATH         Output directory (default: ./forensics_output)

Examples:
  # Basic analysis
  /blockchain-forensics --token 0x123...

  # Comprehensive report for client
  /blockchain-forensics --token 0x123... --export-all --output-dir reports/client_acme

  # Reproducible compliance report
  /blockchain-forensics --token 0x123... --seed 999 --export-all

  # Large dataset analysis
  /blockchain-forensics --token 0x123... --limit 5000 --export-csv
```

## Blockchain Support

Currently supports blockchains with **Blockscout-style explorers**:

✅ **Supported:**
- Boom blockchain (boomscan.io) - Default
- Any EVM chain with Blockscout API
- Etherscan-compatible RPC endpoints
- Blockscout REST v2 endpoints

**API Fallback System:**
1. Tries Etherscan-compatible RPC: `/api?module=account&action=tokentx`
2. Falls back to Blockscout REST v2: `/api/v2/tokens/{address}/transfers`
3. Automatic retry with exponential backoff (3 attempts)

To add new blockchain:
```bash
# Edit boomscan_forensics.py:
BLOCKCHAIN_APIS = {
    'boomscan': 'https://boomscan.io',
    'newchain': 'https://explorer.newchain.io',
}
```

## Output Files

### Standard Analysis (Terminal Only)
- No files created
- Results printed to stdout
- Ideal for quick checks

### With --export-csv
```
forensics_output/
├── transfers.csv              # All transfer records
└── analysis_summary.csv       # Metrics summary
```

### With --export-html
```
forensics_output/
└── forensics_report.html      # Professional report (9KB)
```

### With --export-graph
```
forensics_output/
└── network_graph.png          # Visual loop detection (150dpi)
```

### With --export-all
```
forensics_output/
├── forensics_report.html      # Professional dashboard
├── transfers.csv              # Raw transfer data
├── analysis_summary.csv       # Metrics summary
├── network_graph.png          # Visual graph
└── ANALYSIS_RESULTS.md        # Detailed technical report (auto-generated)
```

## Integration with Client Workflows

### For Security Audits

```bash
# 1. Initial analysis
/blockchain-forensics --token 0xClientToken --export-all --output-dir audits/client_2026_03

# 2. Review findings
cd audits/client_2026_03
open forensics_report.html

# 3. If high confidence manipulation detected:
# - Include in audit report
# - Recommend client address findings
# - Provide evidence package (CSV + HTML + MD)

# 4. If medium confidence:
# - Request clarification from client
# - Expand analysis timeframe
# - Compare with similar projects
```

### For Token Listings

```bash
# Pre-listing checklist
/blockchain-forensics --token 0xCandidateToken --limit 2000 --export-html

# Review:
# - Confidence score must be < 6/10 for approval
# - Concentration must be < 50%
# - Alternation score must be < 15%
# - At least 20+ unique addresses

# If fails: Reject or request explanation
# If passes: Proceed with listing
```

### For Investor Reports

```bash
# Generate investor-friendly report
/blockchain-forensics --token 0xInvestmentToken --seed 12345 --export-all

# Deliverables:
# - forensics_report.html (share with investors)
# - network_graph.png (visual evidence)
# - ANALYSIS_RESULTS.md (technical details)
```

## Best Practices

### ✅ DO:

1. **Use deterministic seeds for compliance**
   ```bash
   /blockchain-forensics --token 0x... --seed 12345 --export-all
   ```
   - Ensures reproducible results
   - Critical for legal/regulatory evidence

2. **Fetch larger samples for accuracy**
   ```bash
   /blockchain-forensics --token 0x... --limit 2000
   ```
   - More transfers = more confident results
   - Minimum recommended: 500 transfers

3. **Export everything for client reports**
   ```bash
   /blockchain-forensics --token 0x... --export-all --output-dir reports/client
   ```
   - Professional presentation
   - Multiple evidence formats

4. **Document findings in tickets**
   - Link to HTML report
   - Include confidence score
   - Specify recommendation

5. **Compare with similar tokens**
   - Run analysis on comparable projects
   - Establish baseline metrics
   - Identify outliers

### ❌ DON'T:

1. **Don't analyze with too few transfers**
   - Minimum: 50 transfers
   - Recommended: 500+
   - Small samples = unreliable

2. **Don't ignore medium confidence scores**
   - 6-7/10 requires investigation
   - May indicate legitimate market making
   - Or sophisticated manipulation

3. **Don't rely solely on one metric**
   - Use all 4 detection algorithms
   - High confidence = multiple indicators aligned
   - One metric alone can be misleading

4. **Don't share raw addresses publicly**
   - Privacy considerations
   - Use truncated addresses in reports
   - Full addresses only in secure evidence packages

5. **Don't forget to update analysis over time**
   - Patterns change
   - Re-analyze periodically
   - Track evolution in ticket comments

## Troubleshooting

### Issue: "No transfers found"

**Causes:**
- Token contract address incorrect
- Token has no recent activity
- API endpoint down or rate limiting

**Solutions:**
```bash
# Verify contract on blockchain explorer first
open https://boomscan.io/address/0xYourToken

# Try with lower limit
/blockchain-forensics --token 0x... --limit 100

# Check API status manually
curl "https://boomscan.io/api/v2/tokens/0xYourToken/transfers?type=ERC-20"
```

### Issue: "API rate limiting"

**Causes:**
- Too many requests in short time
- Large transfer limit

**Solutions:**
```bash
# Wait 1 minute between requests
# Built-in retry handles temporary limits

# Reduce limit
/blockchain-forensics --token 0x... --limit 500

# Run during off-peak hours
```

### Issue: "Low confidence despite suspicious activity"

**Causes:**
- Small sample size
- Sophisticated manipulation (varied timing/amounts)
- Mix of organic and fake activity

**Solutions:**
```bash
# Increase sample size
/blockchain-forensics --token 0x... --limit 5000

# Compare alternation score to concentration
# High alternation + high concentration = manipulation even if confidence is 5-6

# Manual review of CSV data
/blockchain-forensics --token 0x... --export-csv
# Open transfers.csv and look for patterns
```

### Issue: "Network graph not generating"

**Causes:**
- Missing dependencies (networkx, matplotlib)

**Solutions:**
```bash
# Install dependencies
pip3 install --user networkx matplotlib

# Or skip graph generation
/blockchain-forensics --token 0x... --export-html --export-csv
# HTML and CSV work without extra deps
```

## Real-World Example: Boom bNGN

**Case Study:**

```bash
# Command run
/blockchain-forensics --token 0x982F720fbcf3fa55da3621AB1aC3532c5FE5f07A

# Results
Classification: WASH-LIKE LOOPING
Confidence: 10/10

Key Metrics:
- Unique addresses: 2 (CRITICAL - only 2 wallets)
- Top 2 concentration: 100% (EXTREME)
- Alternation score: 72.92% (3.6x wash trading threshold)
- Timing regularity: 14.7% (extreme bot automation)
- Loop pattern: YES (100% isolation)

Verdict:
Perfect textbook case of wash trading. Two wallets trading back and forth
every 34 seconds with zero organic participation. 31.5 billion bNGN volume
is entirely artificial. Maximum confidence score.

Recommendation:
- Investors: AVOID
- Exchanges: FLAG/DELIST
- Regulators: INVESTIGATE
```

**Evidence Package Generated:**
- `forensics_report.html` - Professional HTML report
- `transfers.csv` - 50 transfer records
- `BOOM_ANALYSIS_RESULTS.md` - 20KB technical analysis

**Outcome:**
- Clear evidence for client
- Regulatory submission ready
- Investor warning issued

## Performance & Limits

**Execution Time:**
- 500 transfers: ~10-15 seconds
- 1000 transfers: ~15-20 seconds
- 2000 transfers: ~30-45 seconds
- Bottleneck: API requests (not computation)

**Memory Usage:**
- <50MB for 10,000 transfers
- Lightweight transfer objects
- Safe for cloud functions

**API Rate Limits:**
- Built-in: 3 retries with exponential backoff
- Boomscan: ~5 requests/second (estimated)
- For large analyses: Space out requests

## Security & Ethics

### ✅ Appropriate Uses:
- Security audits for clients
- Due diligence investigations
- Market surveillance (authorized)
- Compliance reporting
- Investor protection research
- Educational demonstrations

### ❌ Prohibited Uses:
- Privacy invasion attempts
- Unauthorized monitoring of individuals
- Harassment or targeting
- Facilitating market manipulation
- Regulatory evasion

### Legal Compliance:
- All data is from **public blockchains**
- No private keys or PII accessed
- Analysis only (not intervention)
- Follow local regulations for surveillance
- Consult legal before regulatory submissions

## Related Skills

- `/code-quality` - For reviewing smart contract code
- `/ci-cd-compliance` - For deployment verification
- `/mandatory-tdd` - For testing analysis scripts
- `/delivery-checklist` - For client deliverable preparation

## References

See skill references directory for:
- `detection-algorithms.md` - Deep dive into each algorithm
- `interpretation-guide.md` - How to read results
- `case-studies.md` - Real examples with outcomes
- `api-integration.md` - Adding new blockchain explorers

## Maintenance

**Dependencies:**
- Core: `requests` (always required)
- Extended: `pandas`, `networkx`, `matplotlib` (for graphs)

**Update Frequency:**
- Check for Boomscan API changes: Monthly
- Update DEX router signatures: As new patterns emerge
- Adjust thresholds: Based on false positive/negative rates

**Known Limitations:**
- Requires Blockscout-style API
- Limited to EVM-compatible chains
- Cannot detect off-chain arrangements
- Sophisticated actors may evade detection

---

**Skill Version:** 1.0.0
**Last Updated:** 2026-03-03
**Maintainer:** AINative Security Team
**Status:** Production Ready ✅
