import { getSentiment, UP_IS_GOOD, DOWN_IS_GOOD } from '@/lib/kpi/sentimentConfig';
import { getDeltaDirection, getDeltaSentiment, formatDeltaPercent, formatDeltaAbsolute } from '@/lib/kpi/deltaUtils';

describe('getSentiment', () => {
  it('revenue up is good', () => {
    expect(getSentiment('total_revenue', 10)).toBe('good');
  });

  it('revenue down is bad', () => {
    expect(getSentiment('total_revenue', -10)).toBe('bad');
  });

  it('expenses up is bad', () => {
    expect(getSentiment('total_expenses', 10)).toBe('bad');
  });

  it('expenses down is good', () => {
    expect(getSentiment('total_expenses', -10)).toBe('good');
  });

  it('null delta is neutral', () => {
    expect(getSentiment('total_revenue', null)).toBe('neutral');
  });

  it('zero delta is neutral', () => {
    expect(getSentiment('total_revenue', 0)).toBe('neutral');
  });

  it('unknown metric is neutral', () => {
    expect(getSentiment('unknown_metric', 10)).toBe('neutral');
  });
});

describe('getDeltaDirection', () => {
  it('positive is up', () => {
    expect(getDeltaDirection(10)).toBe('up');
  });

  it('negative is down', () => {
    expect(getDeltaDirection(-5)).toBe('down');
  });

  it('null is neutral', () => {
    expect(getDeltaDirection(null)).toBe('neutral');
  });

  it('zero is neutral', () => {
    expect(getDeltaDirection(0)).toBe('neutral');
  });
});

describe('formatDeltaPercent', () => {
  it('formats positive with +', () => {
    expect(formatDeltaPercent(12.4)).toBe('+12.4%');
  });

  it('formats negative without +', () => {
    expect(formatDeltaPercent(-8.1)).toBe('-8.1%');
  });

  it('formats null as dash', () => {
    expect(formatDeltaPercent(null)).toBe('—');
  });
});

describe('formatDeltaAbsolute', () => {
  it('formats positive currency', () => {
    const result = formatDeltaAbsolute(5200, 'currency');
    expect(result).toContain('+');
    expect(result).toContain('$');
  });

  it('formats null as dash', () => {
    expect(formatDeltaAbsolute(null, 'currency')).toBe('—');
  });
});

describe('sentiment config completeness', () => {
  it('UP_IS_GOOD has expected metrics', () => {
    expect(UP_IS_GOOD).toContain('total_revenue');
    expect(UP_IS_GOOD).toContain('net_profit');
    expect(UP_IS_GOOD).toContain('cash_on_hand');
    expect(UP_IS_GOOD).toContain('runway_months');
  });

  it('DOWN_IS_GOOD has expected metrics', () => {
    expect(DOWN_IS_GOOD).toContain('total_expenses');
    expect(DOWN_IS_GOOD).toContain('burn_rate');
    expect(DOWN_IS_GOOD).toContain('dso');
  });

  it('no overlap between UP_IS_GOOD and DOWN_IS_GOOD', () => {
    const overlap = UP_IS_GOOD.filter(m => DOWN_IS_GOOD.includes(m));
    expect(overlap).toHaveLength(0);
  });
});
