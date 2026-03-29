import { METRIC_DICTIONARY, EXECUTIVE_METRICS } from '@/lib/kpi/metricDictionary';
import { getMetricByName, getMetricsByCategory, getMetricUnit, getAllActiveMetrics, getExecutiveMetrics } from '@/lib/kpi/metricUtils';

describe('MetricDictionary', () => {
  it('contains all expected MVP metrics', () => {
    expect(METRIC_DICTIONARY.length).toBeGreaterThanOrEqual(19);
  });

  it('has unique metric_names', () => {
    const names = METRIC_DICTIONARY.map(m => m.metric_name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('every metric has required fields', () => {
    for (const m of METRIC_DICTIONARY) {
      expect(m.metric_name).toBeTruthy();
      expect(m.display_name).toBeTruthy();
      expect(m.description).toBeTruthy();
      expect(m.metric_unit).toBeTruthy();
      expect(m.metric_category).toBeTruthy();
      expect(m.formula_text).toBeTruthy();
      expect(typeof m.sort_order).toBe('number');
    }
  });

  it('executive metrics list has 9 entries', () => {
    expect(EXECUTIVE_METRICS.length).toBe(9);
  });

  it('all executive metrics exist in dictionary', () => {
    for (const name of EXECUTIVE_METRICS) {
      expect(getMetricByName(name)).toBeDefined();
    }
  });
});

describe('getMetricByName', () => {
  it('finds total_revenue', () => {
    const m = getMetricByName('total_revenue');
    expect(m?.display_name).toBe('Total Revenue');
    expect(m?.metric_unit).toBe('currency');
    expect(m?.metric_category).toBe('revenue');
  });

  it('returns undefined for unknown metric', () => {
    expect(getMetricByName('nonexistent')).toBeUndefined();
  });
});

describe('getMetricsByCategory', () => {
  it('returns revenue metrics', () => {
    const metrics = getMetricsByCategory('revenue');
    expect(metrics.length).toBeGreaterThanOrEqual(3);
    expect(metrics.every(m => m.metric_category === 'revenue')).toBe(true);
  });
});

describe('getMetricUnit', () => {
  it('returns currency for total_revenue', () => {
    expect(getMetricUnit('total_revenue')).toBe('currency');
  });

  it('returns days for dso', () => {
    expect(getMetricUnit('dso')).toBe('days');
  });

  it('returns months for runway_months', () => {
    expect(getMetricUnit('runway_months')).toBe('months');
  });

  it('returns count for unknown metric', () => {
    expect(getMetricUnit('unknown')).toBe('count');
  });
});

describe('getExecutiveMetrics', () => {
  it('returns 9 metrics', () => {
    expect(getExecutiveMetrics().length).toBe(9);
  });
});
