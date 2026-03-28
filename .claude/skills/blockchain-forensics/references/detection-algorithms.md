# Detection Algorithms Deep Dive

This document provides detailed technical explanations of the four core detection algorithms used in blockchain forensic analysis.

## Algorithm 1: Alternation Score (A↔B Loop Detection)

### Purpose
Detect wash trading loops where two addresses trade back and forth to artificially inflate volume.

### Mathematical Definition

```python
def calculate_alternation_score(transfers, window_seconds=3600):
    """
    Calculate percentage of transfer sequences that follow A↔B pattern.

    Args:
        transfers: List of Transfer objects sorted by timestamp
        window_seconds: Time window for pattern detection (default: 1 hour)

    Returns:
        float: Percentage (0-100) of sequences showing alternation
    """
    alternations = 0
    total_sequences = 0

    for i in range(len(transfers) - 2):
        t1, t2, t3 = transfers[i:i+3]

        # Check if all 3 transfers are within time window
        if t3.timestamp - t1.timestamp <= window_seconds:
            # Pattern 1: A→B→A (forward loop)
            if (t1.from_addr == t3.from_addr and
                t1.to_addr == t2.from_addr):
                alternations += 1

            # Pattern 2: B→A→B (reverse loop)
            elif (t1.to_addr == t3.to_addr and
                  t1.from_addr == t2.to_addr):
                alternations += 1

            total_sequences += 1

    return (alternations / total_sequences * 100) if total_sequences > 0 else 0
```

### Interpretation Thresholds

| Score Range | Interpretation | Confidence | Typical Scenario |
|-------------|----------------|------------|------------------|
| 0-10% | Organic trading | Low suspicion | Normal market activity, diverse participants |
| 10-20% | Market making | Medium | Professional liquidity providers |
| 20-40% | Suspicious | High | Possible wash trading, needs investigation |
| 40-60% | Very suspicious | Very high | Likely coordinated manipulation |
| 60-100% | Extreme | Maximum | Textbook wash trading pattern |

### Real-World Examples

**Example 1: Boom bNGN (72.92% score)**
```
Pattern detected:
Transfer 1: 0x261a → 0xc77b (timestamp: T)
Transfer 2: 0xc77b → 0x261a (timestamp: T+34s)  ← Alternation!
Transfer 3: 0x261a → 0xc77b (timestamp: T+68s)  ← Alternation!
...
Result: 35/48 sequences = 72.92% alternation
Classification: Extreme wash trading
```

**Example 2: Healthy DEX Token (8% score)**
```
Pattern:
Transfer 1: 0xAAA → 0xBBB
Transfer 2: 0xCCC → 0xDDD  ← No alternation
Transfer 3: 0xEEE → 0xFFF  ← No alternation
...
Result: 4/50 sequences = 8% alternation
Classification: Organic trading
```

### Why It Works

**Wash Trading Signature:**
- Two coordinated wallets (A and B)
- Trade back and forth repeatedly
- Goal: Inflate volume metrics
- Pattern: A→B, B→A, A→B, B→A...
- Very high alternation score (>50%)

**Organic Trading Signature:**
- Many diverse participants (A, B, C, D, E, F...)
- Trades don't create repetitive loops
- Pattern: A→B, C→D, E→F, G→H...
- Low alternation score (<10%)

**Market Making Signature:**
- Professional trader (A) provides liquidity
- Many users trade with A
- Pattern: B→A, A→C, D→A, A→E...
- Moderate alternation score (10-20%)

### Edge Cases & Limitations

**False Positives:**
1. **Small sample size** - With only 10 transfers, random chance can create patterns
   - Mitigation: Require minimum 50 transfers for analysis
2. **Single liquidity provider** - One DEX pool receiving all trades
   - Mitigation: Check if addresses are contracts (DEX pools)
3. **P2P market making** - Legitimate high-frequency trading
   - Mitigation: Cross-check with other algorithms

**False Negatives:**
1. **Multiple wash trading pairs** - Actors use A↔B, C↔D, E↔F
   - Mitigation: Concentration analysis catches this
2. **Delayed loops** - A→B (1 day), B→A (1 day later)
   - Mitigation: Adjust window_seconds parameter
3. **Randomized timing** - Sophisticated actors add jitter
   - Mitigation: Timing regularity algorithm detects this

### Parameter Tuning

**Window Size Selection:**
```python
# Short window (5 minutes) - Catches rapid bot loops
window_seconds = 300

# Medium window (1 hour) - Default, balanced detection
window_seconds = 3600

# Long window (24 hours) - Catches slow manipulation
window_seconds = 86400
```

**Recommendation:** Use 1-hour window for most cases. Adjust for specific scenarios:
- High-frequency trading: 5-15 minutes
- Low-volume tokens: 6-24 hours
- Compliance reports: Test multiple windows

---

## Algorithm 2: Concentration Analysis

### Purpose
Measure dominance by top addresses to identify coordinated control.

### Mathematical Definition

```python
def calculate_concentration(transfers):
    """
    Calculate address concentration metrics.

    Returns:
        dict: Contains unique_addresses, top_by_count, top_by_volume,
              concentration ratios
    """
    # Count participation (both from and to)
    address_counter = Counter()
    for t in transfers:
        address_counter[t.from_addr] += 1
        address_counter[t.to_addr] += 1

    # Volume by address
    volume_by_addr = defaultdict(float)
    for t in transfers:
        volume_by_addr[t.from_addr] += t.value_decimal
        volume_by_addr[t.to_addr] += t.value_decimal

    # Top addresses
    top_by_count = address_counter.most_common(10)
    top_by_volume = sorted(volume_by_addr.items(),
                           key=lambda x: x[1], reverse=True)[:10]

    # Concentration ratios
    total_interactions = len(transfers) * 2  # Count from and to separately
    top2_count = sum([c for _, c in top_by_count[:2]])
    top5_count = sum([c for _, c in top_by_count[:5]])

    total_volume = sum(volume_by_addr.values())
    top2_volume = sum([v for _, v in top_by_volume[:2]])
    top5_volume = sum([v for _, v in top_by_volume[:5]])

    return {
        'unique_addresses': len(address_counter),
        'top2_count_ratio': top2_count / total_interactions,
        'top5_count_ratio': top5_count / total_interactions,
        'top2_volume_ratio': top2_volume / total_volume,
        'top5_volume_ratio': top5_volume / total_volume,
        'total_volume': total_volume,
    }
```

### Interpretation Thresholds

**By Count (Transfer Frequency):**

| Top 2 Ratio | Top 5 Ratio | Interpretation | Risk Level |
|-------------|-------------|----------------|------------|
| <20% | <40% | Highly decentralized | Very low |
| 20-30% | 40-50% | Normal healthy distribution | Low |
| 30-50% | 50-70% | Moderate concentration | Medium |
| 50-70% | 70-85% | High concentration | High |
| >70% | >85% | Extreme concentration | Very high |
| 100% | 100% | Perfect wash (only 2-5 addresses) | Maximum |

**By Volume:**

| Top 2 Volume | Top 5 Volume | Interpretation | Risk Level |
|--------------|--------------|----------------|------------|
| <30% | <50% | Distributed ownership | Low |
| 30-50% | 50-70% | Normal for new tokens | Medium |
| 50-70% | 70-90% | High whale presence | High |
| >70% | >90% | Extreme control | Very high |

### Real-World Examples

**Example 1: Boom bNGN (100% concentration)**
```
Unique addresses: 2
Top 2 by count: 100% (50 + 50 = 100 out of 100 total)
Top 2 by volume: 100% (15.75B + 15.75B = 31.5B out of 31.5B)

Interpretation: Perfect wash trading
Only 2 addresses control ALL activity
```

**Example 2: Healthy DeFi Token (23% concentration)**
```
Unique addresses: 127
Top 2 by count: 23% (130 + 110 = 240 out of 1000 total)
Top 2 by volume: 18% (1.2M + 0.8M = 2M out of 11M)

Interpretation: Decentralized, healthy
Many participants, low concentration
```

**Example 3: Market Making (45% concentration)**
```
Unique addresses: 34
Top 2 by count: 45% (250 + 200 = 450 out of 1000 total)
Top 2 by volume: 52% (5M + 3M = 8M out of 15M)

Interpretation: Professional market makers
Moderate concentration, likely legitimate
```

### Herfindahl-Hirschman Index (HHI)

For more sophisticated analysis, calculate HHI:

```python
def calculate_hhi(address_counts):
    """
    Calculate Herfindahl-Hirschman Index for market concentration.
    HHI = sum of squared market shares
    """
    total = sum(address_counts.values())
    hhi = sum((count / total) ** 2 for count in address_counts.values())
    return hhi * 10000  # Scale to 0-10000

# Interpretation:
# HHI < 1500: Competitive (healthy)
# HHI 1500-2500: Moderately concentrated
# HHI > 2500: Highly concentrated (suspicious)
# HHI > 8000: Near monopoly (wash trading)
```

### Why It Works

**Wash Trading:**
- Controlled by 2-5 addresses
- High concentration (>60%)
- Perfect mathematical symmetry

**Organic Trading:**
- Many participants (50-500+ addresses)
- Low concentration (<30%)
- Power law distribution

**Market Making:**
- Moderate concentration (30-60%)
- Few large players + many small
- Typical for professional liquidity provision

---

## Algorithm 3: Timing Regularity

### Purpose
Detect bot/automated trading through timing consistency analysis.

### Mathematical Definition

```python
def analyze_timing_regularity(transfers):
    """
    Analyze inter-event timing patterns.

    Returns:
        dict: Contains median_delta, stdev_delta, histogram
    """
    sorted_transfers = sorted(transfers, key=lambda t: t.timestamp)

    # Calculate time deltas between consecutive transfers
    deltas = []
    for i in range(len(sorted_transfers) - 1):
        delta = sorted_transfers[i+1].timestamp - sorted_transfers[i].timestamp
        deltas.append(delta)

    # Statistical measures
    median_delta = statistics.median(deltas)
    stdev_delta = statistics.stdev(deltas) if len(deltas) > 1 else 0

    # Regularity ratio
    regularity_ratio = stdev_delta / median_delta if median_delta > 0 else 0

    # Create histogram buckets
    histogram = categorize_intervals(deltas)

    return {
        'median_delta': median_delta,
        'stdev_delta': stdev_delta,
        'regularity_ratio': regularity_ratio,
        'histogram': histogram,
    }
```

### Interpretation Thresholds

**Regularity Ratio (StdDev / Median):**

| Ratio | Interpretation | Pattern | Likelihood |
|-------|----------------|---------|------------|
| >100% | Extreme variance | Human, random | Organic trading |
| 50-100% | High variance | Human, some patterns | Healthy market |
| 30-50% | Moderate variance | Mix of human/bot | Market making |
| 15-30% | Low variance | Bot-like | Suspicious |
| <15% | Very low variance | Highly automated | Wash trading |

### Real-World Examples

**Example 1: Boom bNGN (14.7% ratio = bot-like)**
```
Median: 34 seconds
StdDev: 5 seconds
Ratio: 5/34 = 14.7%

Histogram:
  <1min: 49 transfers (100%)
  All other buckets: 0

Interpretation: Extreme bot automation
Nearly perfect timing consistency
```

**Example 2: Human Trading (78% ratio = organic)**
```
Median: 18 minutes
StdDev: 14 minutes
Ratio: 14/18 = 78%

Histogram:
  <1min: 3 (6%)
  1-5min: 12 (24%)
  5-15min: 18 (36%)
  15-60min: 10 (20%)
  >1hr: 7 (14%)

Interpretation: Normal human variation
Diverse timing patterns
```

**Example 3: Market Making Bot (25% ratio = professional)**
```
Median: 2 minutes
StdDev: 30 seconds
Ratio: 0.5/2 = 25%

Histogram:
  <1min: 8 (16%)
  1-5min: 35 (70%)
  5-15min: 7 (14%)

Interpretation: Professional bot
Regular but not suspiciously so
```

### Statistical Tests

**Coefficient of Variation (CV):**
```python
cv = (stdev / mean) * 100
# CV < 30% = Low variation (bot-like)
# CV 30-70% = Moderate (mixed)
# CV > 70% = High variation (human)
```

**Chi-Square Test for Uniformity:**
```python
# Test if intervals follow uniform distribution (bots)
# or exponential distribution (humans)
from scipy.stats import chisquare

expected_uniform = [len(deltas) / num_buckets] * num_buckets
chi2, p_value = chisquare(observed, expected_uniform)

# p < 0.05 = Reject uniformity (not bot-like)
# p > 0.05 = Cannot reject (possibly bot)
```

### Why It Works

**Bot Signature:**
- Executes trades on fixed schedule
- Minimal timing variance
- Often round numbers (30s, 60s, 5min)
- Histogram shows sharp peak

**Human Signature:**
- Reacts to events, emotions, availability
- High timing variance
- No regular pattern
- Histogram shows broad distribution

---

## Algorithm 4: Loop Pattern Detection

### Purpose
Identify isolated counterparty relationships indicating coordinated trading.

### Mathematical Definition

```python
def analyze_address_deep_dive(address, transfers):
    """
    Analyze counterparty relationships for specific address.

    Returns:
        dict: Contains counterparty metrics and loop pattern detection
    """
    # Filter transfers involving this address
    addr_transfers = [t for t in transfers
                     if t.from_addr == address or t.to_addr == address]

    # Count unique counterparties
    counterparties = Counter()
    for t in addr_transfers:
        if t.from_addr == address:
            counterparties[t.to_addr] += 1
        if t.to_addr == address:
            counterparties[t.from_addr] += 1

    # Calculate top counterparty concentration
    total_interactions = sum(counterparties.values())
    top_counterparty = counterparties.most_common(1)[0] if counterparties else (None, 0)
    top_concentration = top_counterparty[1] / total_interactions if total_interactions > 0 else 0

    # Detect loop pattern
    is_loop_pattern = (
        len(counterparties) <= 3 and  # Very few partners
        top_concentration > 0.7        # High concentration with one
    )

    return {
        'total_transfers': len(addr_transfers),
        'unique_counterparties': len(counterparties),
        'top_counterparties': counterparties.most_common(5),
        'top_concentration': top_concentration,
        'is_loop_pattern': is_loop_pattern,
    }
```

### Interpretation Thresholds

**Loop Pattern Detection:**

| Counterparties | Top Concentration | Pattern | Risk Level |
|----------------|-------------------|---------|------------|
| >20 | <30% | Diverse trading | Very low |
| 10-20 | 30-50% | Normal market | Low |
| 5-10 | 50-70% | Market maker | Medium |
| 3-5 | 70-85% | Suspicious loop | High |
| 1-2 | >85% | Confirmed loop | Very high |
| 1 | 100% | Perfect A↔B loop | Maximum |

### Real-World Examples

**Example 1: Boom bNGN (Perfect loop)**
```
Address: 0xc77b35e3...
Counterparties: 1
Top counterparty: 0x261a97b0... (50 interactions)
Top concentration: 100%
Loop pattern: YES

Interpretation: Perfect A↔B wash trading
Address interacts ONLY with one other wallet
```

**Example 2: Healthy Trader (Diverse)**
```
Address: 0xABCD1234...
Counterparties: 47
Top counterparty: 0xDEX... (8 interactions)
Top concentration: 17%
Loop pattern: NO

Interpretation: Normal trading behavior
Interacts with many different addresses
```

**Example 3: Market Maker (Moderate)**
```
Address: 0xMM123456...
Counterparties: 8
Top counterparty: 0xDEXPool... (45 interactions)
Top concentration: 73%
Loop pattern: YES (but top counterparty is DEX pool)

Interpretation: Professional market maker
High concentration with DEX pool is normal
```

### Network Analysis Extension

For deeper loop detection, use graph theory:

```python
import networkx as nx

def detect_loops_graph(transfers):
    """
    Use NetworkX to detect cycles in transaction graph.
    """
    G = nx.DiGraph()

    for t in transfers:
        if G.has_edge(t.from_addr, t.to_addr):
            G[t.from_addr][t.to_addr]['weight'] += 1
        else:
            G.add_edge(t.from_addr, t.to_addr, weight=1)

    # Find cycles
    cycles = list(nx.simple_cycles(G))

    # Find bidirectional edges (A→B and B→A)
    bidirectional = []
    for u, v in G.edges():
        if G.has_edge(v, u):
            bidirectional.append((u, v, G[u][v]['weight'], G[v][u]['weight']))

    return {
        'cycles': cycles,
        'bidirectional_edges': bidirectional,
        'loop_score': len(bidirectional) / len(G.edges()) * 100
    }
```

### Why It Works

**Wash Trading Loop:**
- Address A ↔ Address B
- High reciprocity (both directions)
- Isolated from rest of market
- Top concentration >80%

**Organic Trading:**
- Address A → Many different addresses
- Low reciprocity (mostly one-way)
- Connected to broader market
- Top concentration <30%

**Market Making:**
- Address MM ↔ DEX Pool/Router
- High reciprocity but with contract
- Connected through DEX to market
- Verify counterparty is contract

---

## Combined Confidence Scoring

### Scoring System

```python
def classify_activity(concentration, alternation_score, timing, deep_dive):
    """
    Combine all 4 algorithms into unified confidence score.
    """
    signals = []
    confidence = 5  # Start neutral

    # Algorithm 1: Concentration
    if concentration['top2_count_ratio'] > 0.6:
        signals.append("High address concentration (top 2 > 60%)")
        confidence += 1

    # Algorithm 2: Alternation
    if alternation_score > 20:
        signals.append(f"High alternation score ({alternation_score:.1f}%)")
        confidence += 2

    # Algorithm 3: Timing
    timing_ratio = timing['stdev_delta'] / timing['median_delta'] if timing['median_delta'] > 0 else 1
    if timing_ratio < 0.3:
        signals.append("Very regular timing (low variance)")
        confidence += 1

    # Algorithm 4: Loop pattern
    if deep_dive.get('is_loop_pattern'):
        signals.append("Address shows 1-2 counterparty loop pattern")
        confidence += 2

    # Cap at 10
    confidence = min(confidence, 10)

    # Classify
    if confidence >= 8:
        classification = "wash-like looping"
    elif confidence >= 6:
        classification = "market-making / liquidity bootstrapping"
    elif deep_dive.get('unique_counterparties', 0) < 5 and alternation_score > 15:
        classification = "test automation"
    else:
        classification = "organic multi-user trading"

    reasoning = "; ".join(signals) if signals else "Low concentration, diverse participants"

    return classification, confidence, reasoning
```

### Decision Matrix

| Concentration | Alternation | Timing | Loop | Confidence | Classification |
|---------------|-------------|--------|------|------------|----------------|
| >60% | >50% | <20% | Yes | 10 | Wash trading |
| >60% | >20% | <30% | Yes | 9 | Wash trading |
| >50% | >20% | <30% | No | 7-8 | Market making |
| <30% | >30% | Any | Yes | 6-7 | Suspicious |
| <30% | <10% | >50% | No | 1-3 | Organic |

---

## Validation & Calibration

### Testing Against Known Cases

**Validated Wash Trading Cases:**
1. Boom bNGN: 10/10 confidence ✅
2. [Other known cases to be added]

**Validated Organic Cases:**
1. Uniswap V2 WETH-USDC: 2/10 confidence ✅
2. [Other known cases to be added]

### False Positive Rate

Target: <5% false positive rate
- Current: Testing in progress
- Calibration: Adjust thresholds based on feedback

### Continuous Improvement

As new manipulation patterns emerge:
1. Update detection thresholds
2. Add new algorithms
3. Refine existing logic
4. Document case studies

---

**Last Updated:** 2026-03-03
**Methodology Version:** 1.0
**Validation Status:** Production ready with ongoing calibration
