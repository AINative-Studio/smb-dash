# Blockchain Forensics Skill

Automated forensic analysis tool for detecting wash trading and market manipulation in blockchain tokens.

## Quick Start

### As a Slash Command
```bash
/blockchain-forensics --token 0xYourTokenAddress
```

### As a Helper Script
```bash
# Quick analysis
.claude/skills/blockchain-forensics/scripts/quick-analyze.sh 0xToken 1000

# Generate client report
.claude/skills/blockchain-forensics/scripts/generate-client-report.sh 0xToken ClientName 12345
```

### Programmatically
```bash
# Basic terminal output
TOKEN_CONTRACT=0xToken LIMIT=1000 python3 boomscan_forensics.py

# With HTML/CSV exports
python3 boomscan_forensics_extended.py --token 0xToken --export-all
```

## What It Does

Analyzes blockchain token transfers to detect:
- **Wash trading** - Artificial volume through coordinated loops
- **Bot manipulation** - Automated trading patterns
- **Concentration** - Wallet dominance indicating coordination
- **Loop patterns** - A↔B trading relationships

## Output

- **Classification**: Type of activity (wash trading, market making, organic, etc.)
- **Confidence Score**: 1-10 (higher = more certain of manipulation)
- **Key Metrics**: Concentration, alternation, timing, loop patterns
- **Recommendation**: Avoid/Monitor/Proceed

## Real Example (Boom bNGN)

```
Classification: WASH-LIKE LOOPING
Confidence: 10/10

Evidence:
- Only 2 addresses control 100% of activity
- 72.92% alternation score (extreme A↔B looping)
- Bot-like timing (34s ± 5s intervals)
- Perfect isolated loop pattern

Recommendation: AVOID - Clear wash trading detected
```

## Files

```
.claude/skills/blockchain-forensics/
├── SKILL.md                           # Comprehensive skill documentation
├── README.md                          # This file
├── references/
│   ├── detection-algorithms.md        # Algorithm deep-dive
│   └── interpretation-guide.md        # How to interpret results
└── scripts/
    ├── quick-analyze.sh              # Fast analysis wrapper
    └── generate-client-report.sh     # Professional report generator

.claude/commands/
└── blockchain-forensics.md            # Slash command definition

Root directory:
├── boomscan_forensics.py             # Main analyzer (terminal output)
└── boomscan_forensics_extended.py    # Extended (HTML/CSV/graphs)
```

## Usage Examples

### For Client Work
```bash
/blockchain-forensics --token 0xClientToken --export-all --output-dir reports/acme_corp
```
Generates professional HTML report, CSV data, and analysis documentation.

### For Quick Check
```bash
/blockchain-forensics --token 0xToken
```
Immediate terminal output with verdict and confidence score.

### For Compliance
```bash
/blockchain-forensics --token 0xToken --seed 12345 --export-all
```
Reproducible analysis using deterministic seed for evidence.

## Integration with Workflow

**Security Audits:**
1. Run analysis on all client tokens
2. Include confidence score in audit report
3. Flag high-confidence findings (≥8/10) as critical

**Token Listings:**
1. Require analysis before listing approval
2. Reject if confidence ≥7/10 for manipulation
3. Document decision in listing ticket

**Advisory Services:**
1. Generate client report with --export-html
2. Include executive summary
3. Provide recommendations based on confidence

## Dependencies

**Core (always required):**
- Python 3.11+
- `requests` library

**Extended (for HTML/graphs):**
- `pandas` - CSV enhancements
- `networkx` - Network graph generation
- `matplotlib` - Graph plotting

Install:
```bash
pip3 install requests                              # Core
pip3 install pandas networkx matplotlib            # Extended
```

## Detection Algorithms

**1. Alternation Score** - Detects A↔B loops
- Score >20% = suspicious
- Score >50% = wash trading

**2. Concentration** - Measures wallet dominance
- >60% = high concentration
- 100% = perfect wash trading

**3. Timing Regularity** - Identifies bot patterns
- Ratio <30% = bot-like
- Ratio <15% = extreme automation

**4. Loop Pattern** - Finds isolated relationships
- 1-2 counterparties = loop pattern
- >80% concentration = confirmed

## Confidence Scoring

| Score | Meaning | Action |
|-------|---------|--------|
| 9-10 | Extreme manipulation | AVOID/FLAG |
| 8 | High confidence | REJECT |
| 6-7 | Suspicious | INVESTIGATE |
| 4-5 | Low-medium | PROCEED with caution |
| 1-3 | Healthy | PROCEED normally |

## Blockchain Support

Currently supports:
- **Boom blockchain** (boomscan.io) - Default
- Any blockchain with **Blockscout-style API**
- Any blockchain with **Etherscan-compatible RPC**

Automatic fallback:
1. Tries RPC-style endpoint first
2. Falls back to Blockscout REST v2
3. Retries 3 times with exponential backoff

## Limitations

- Requires minimum 50 transfers for reliable analysis
- Cannot detect off-chain coordination
- Sophisticated actors may evade detection
- Public API rate limits may restrict large analyses

## Troubleshooting

**"No transfers found"**
- Verify token contract address
- Check token has activity (visit explorer)
- Try lower limit: `--limit 100`

**"API rate limiting"**
- Wait 1 minute between requests
- Built-in retry handles temporary limits
- Reduce limit if persistent

**"Low confidence despite suspicious metrics"**
- Small sample size - increase `--limit`
- Check if addresses are contracts (DEX pools)
- Review CSV data manually for patterns

## Support

**Documentation:**
- `SKILL.md` - Complete skill guide
- `references/detection-algorithms.md` - Algorithm details
- `references/interpretation-guide.md` - Decision framework

**Scripts:**
- `scripts/quick-analyze.sh` - Fast wrapper
- `scripts/generate-client-report.sh` - Professional reports

**Examples:**
- See `BOOM_ANALYSIS_RESULTS.md` for real case study
- See `forensics_output/` for sample reports

## Version

**Version:** 1.0.0
**Status:** Production Ready ✅
**Last Updated:** 2026-03-03
**Maintainer:** AINative Security Team

## License

MIT License - For authorized security research and auditing purposes only.
