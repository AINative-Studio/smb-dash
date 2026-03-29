import { populateFinancialMetrics, populateKPIComparisons, populateExecutiveMetrics, validateMetricIntegrity } from '@/lib/kpi/factPopulator';
import { EXECUTIVE_METRICS } from '@/lib/kpi/metricDictionary';

const opts = { organizationId: 'org-test', periodId: 'p-test', comparisonPeriodId: 'p-prev' };

describe('populateFinancialMetrics', () => {
  const metrics = populateFinancialMetrics(opts);

  it('returns all expected metrics', () => {
    expect(metrics.length).toBeGreaterThanOrEqual(19);
  });

  it('every metric has a value and unit', () => {
    for (const m of metrics) {
      expect(m.metric_name).toBeTruthy();
      expect(typeof m.metric_value).toBe('number');
      expect(m.metric_unit).toBeTruthy();
      expect(m.period_id).toBe('p-test');
    }
  });

  it('includes delta values when comparison period provided', () => {
    const withDeltas = metrics.filter(m => m.delta_percent !== null);
    expect(withDeltas.length).toBeGreaterThan(0);
  });

  it('no deltas without comparison period', () => {
    const noComp = populateFinancialMetrics({ organizationId: 'org-test', periodId: 'p-test' });
    const withDeltas = noComp.filter(m => m.comparison_type !== null);
    expect(withDeltas.length).toBe(0);
  });
});

describe('populateExecutiveMetrics', () => {
  it('returns exactly 9 executive metrics', () => {
    const exec = populateExecutiveMetrics(opts);
    expect(exec.length).toBe(9);
    expect(exec.every(m => EXECUTIVE_METRICS.includes(m.metric_name))).toBe(true);
  });
});

describe('populateKPIComparisons', () => {
  it('returns comparisons when comparisonPeriodId provided', () => {
    const comps = populateKPIComparisons(opts);
    expect(comps.length).toBeGreaterThan(0);
    expect(comps[0].comparison_type).toBe('previous_month');
    expect(comps[0].organization_id).toBe('org-test');
  });

  it('returns empty when no comparisonPeriodId', () => {
    const comps = populateKPIComparisons({ organizationId: 'org-test', periodId: 'p-test' });
    expect(comps).toHaveLength(0);
  });

  it('delta math is correct', () => {
    const comps = populateKPIComparisons(opts);
    for (const c of comps) {
      expect(c.absolute_delta).toBeCloseTo(c.current_value - c.comparison_value, 0);
      if (c.percent_delta !== null && c.comparison_value !== 0) {
        const expected = ((c.current_value - c.comparison_value) / Math.abs(c.comparison_value)) * 100;
        expect(c.percent_delta).toBeCloseTo(expected, 0);
      }
    }
  });
});

describe('validateMetricIntegrity', () => {
  it('passes with valid metrics', () => {
    const metrics = populateFinancialMetrics(opts);
    const result = validateMetricIntegrity(metrics);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('catches gross_profit > total_revenue', () => {
    const metrics = [
      { metric_name: 'total_revenue', metric_value: 100, metric_unit: 'currency', period_id: 'p', delta_percent: null, delta_absolute: null, comparison_type: null },
      { metric_name: 'gross_profit', metric_value: 200, metric_unit: 'currency', period_id: 'p', delta_percent: null, delta_absolute: null, comparison_type: null },
    ];
    const result = validateMetricIntegrity(metrics);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Gross profit'))).toBe(true);
  });

  it('catches unit mismatch', () => {
    const metrics = [
      { metric_name: 'total_revenue', metric_value: 100, metric_unit: 'percent', period_id: 'p', delta_percent: null, delta_absolute: null, comparison_type: null },
    ];
    const result = validateMetricIntegrity(metrics);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Unit mismatch'))).toBe(true);
  });
});
