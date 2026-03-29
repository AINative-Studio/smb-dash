import { formatCurrency } from '@/lib/formatters/currency';
import { formatPercent } from '@/lib/formatters/percent';
import { formatNumber, formatCompact } from '@/lib/formatters/number';
import { formatDays, formatMonths } from '@/lib/formatters/duration';
import { formatMetricValue } from '@/lib/formatters';

describe('formatCurrency', () => {
  it('formats small values with cents', () => {
    expect(formatCurrency(42.50)).toBe('$42.50');
  });

  it('formats thousands without decimals', () => {
    expect(formatCurrency(125000)).toBe('$125,000');
  });

  it('formats millions with M suffix', () => {
    expect(formatCurrency(1200000)).toBe('$1.2M');
  });

  it('formats billions with B suffix', () => {
    expect(formatCurrency(2500000000)).toBe('$2.5B');
  });

  it('handles negative values', () => {
    expect(formatCurrency(-5000)).toBe('-$5,000');
  });
});

describe('formatPercent', () => {
  it('formats with default 1 decimal', () => {
    expect(formatPercent(12.4)).toBe('12.4%');
  });

  it('formats with custom decimals', () => {
    expect(formatPercent(12.456, 2)).toBe('12.46%');
  });
});

describe('formatNumber', () => {
  it('formats with thousands separators', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });
});

describe('formatCompact', () => {
  it('formats thousands as K', () => {
    expect(formatCompact(1200)).toBe('1.2K');
  });

  it('formats millions as M', () => {
    expect(formatCompact(3500000)).toBe('3.5M');
  });

  it('leaves small numbers as-is', () => {
    expect(formatCompact(42)).toBe('42');
  });
});

describe('formatDays', () => {
  it('formats plural', () => {
    expect(formatDays(34)).toBe('34 days');
  });

  it('formats singular', () => {
    expect(formatDays(1)).toBe('1 day');
  });
});

describe('formatMonths', () => {
  it('formats with decimal', () => {
    expect(formatMonths(8.2)).toBe('8.2 mo');
  });
});

describe('formatMetricValue', () => {
  it('dispatches currency correctly', () => {
    expect(formatMetricValue(125000, 'currency')).toBe('$125,000');
  });

  it('dispatches percent correctly', () => {
    expect(formatMetricValue(42.4, 'percent')).toBe('42.4%');
  });

  it('dispatches days correctly', () => {
    expect(formatMetricValue(34, 'days')).toBe('34 days');
  });

  it('dispatches months correctly', () => {
    expect(formatMetricValue(6.0, 'months')).toBe('6.0 mo');
  });

  it('dispatches count correctly', () => {
    expect(formatMetricValue(1234, 'count')).toBe('1,234');
  });
});
