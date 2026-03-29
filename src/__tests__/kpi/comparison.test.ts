import { calculateDelta, getComparisonPeriod, formatDelta } from '@/lib/kpi/comparison';

describe('calculateDelta', () => {
  it('calculates positive delta correctly', () => {
    const result = calculateDelta(425000, 380000);
    expect(result.absolute).toBe(45000);
    expect(result.percent).toBeCloseTo(11.84, 1);
  });

  it('calculates negative delta correctly', () => {
    const result = calculateDelta(95000, 102000);
    expect(result.absolute).toBe(-7000);
    expect(result.percent).toBeCloseTo(-6.86, 1);
  });

  it('handles zero previous value', () => {
    const result = calculateDelta(100, 0);
    expect(result.absolute).toBe(100);
    expect(result.percent).toBeNull();
  });

  it('handles equal values', () => {
    const result = calculateDelta(100, 100);
    expect(result.absolute).toBe(0);
    expect(result.percent).toBeCloseTo(0);
  });
});

describe('getComparisonPeriod', () => {
  it('calculates previous_year correctly', () => {
    const result = getComparisonPeriod('2026-03-01', '2026-03-31', 'previous_year');
    expect(result.start).toBe('2025-03-01');
    expect(result.end).toBe('2025-03-31');
  });
});

describe('formatDelta', () => {
  it('formats currency delta with sign', () => {
    expect(formatDelta(45000, 'currency')).toBe('+$45,000');
  });

  it('formats negative currency delta', () => {
    expect(formatDelta(-7000, 'currency')).toBe('$7,000');
  });

  it('formats percent delta', () => {
    expect(formatDelta(11.8, 'percent')).toBe('+11.8%');
  });

  it('formats days delta', () => {
    expect(formatDelta(-3, 'days')).toBe('-3 days');
  });
});
