import type { KPIMetric } from '@/lib/types/kpi';
import type { KPIComparison } from '@/lib/types/comparison';
import { EXECUTIVE_METRICS } from './metricDictionary';
import { getMetricByName } from './metricUtils';
import { calculateDelta } from './comparison';

interface PopulateOptions {
  organizationId: string;
  periodId: string;
  comparisonPeriodId?: string;
}

const BASE_VALUES: Record<string, number> = {
  total_revenue: 425000,
  gross_profit: 180000,
  net_profit: 95000,
  cash_on_hand: 312000,
  net_cash_flow: 45000,
  ar_balance: 78500,
  ap_balance: 34200,
  burn_rate: 52000,
  runway_months: 6.0,
  revenue_growth_pct: 11.8,
  avg_invoice_value: 12500,
  gross_margin_pct: 42.4,
  net_margin_pct: 22.4,
  dso: 34,
  dpo: 28,
  overdue_invoice_amount: 43500,
  total_expenses: 330000,
  operating_expense_ratio: 77.6,
  top_customer_concentration_pct: 34.1,
};

const PRIOR_VALUES: Record<string, number> = {
  total_revenue: 380000,
  gross_profit: 165000,
  net_profit: 102000,
  cash_on_hand: 298000,
  net_cash_flow: 38000,
  ar_balance: 72000,
  ap_balance: 38100,
  burn_rate: 48000,
  runway_months: 6.2,
  revenue_growth_pct: 8.5,
  avg_invoice_value: 11800,
  gross_margin_pct: 43.4,
  net_margin_pct: 26.8,
  dso: 32,
  dpo: 30,
  overdue_invoice_amount: 38000,
  total_expenses: 278000,
  operating_expense_ratio: 73.2,
  top_customer_concentration_pct: 31.2,
};

export function populateFinancialMetrics(options: PopulateOptions): KPIMetric[] {
  const metrics: KPIMetric[] = [];

  for (const [name, value] of Object.entries(BASE_VALUES)) {
    const def = getMetricByName(name);
    if (!def) continue;

    const prior = PRIOR_VALUES[name];
    const delta = prior !== undefined ? calculateDelta(value, prior) : null;

    metrics.push({
      metric_name: name,
      metric_value: value,
      metric_unit: def.metric_unit,
      period_id: options.periodId,
      delta_percent: delta?.percent ? Math.round(delta.percent * 10) / 10 : null,
      delta_absolute: delta?.absolute ?? null,
      comparison_type: options.comparisonPeriodId ? 'previous_month' : null,
    });
  }

  return metrics;
}

export function populateKPIComparisons(options: PopulateOptions): KPIComparison[] {
  if (!options.comparisonPeriodId) return [];

  const comparisons: KPIComparison[] = [];

  for (const [name, currentValue] of Object.entries(BASE_VALUES)) {
    const priorValue = PRIOR_VALUES[name];
    if (priorValue === undefined) continue;

    const delta = calculateDelta(currentValue, priorValue);

    comparisons.push({
      id: `comp-${options.organizationId}-${name}`,
      organization_id: options.organizationId,
      metric_name: name,
      current_period_id: options.periodId,
      comparison_period_id: options.comparisonPeriodId,
      current_value: currentValue,
      comparison_value: priorValue,
      absolute_delta: delta.absolute,
      percent_delta: delta.percent ? Math.round(delta.percent * 10) / 10 : null,
      comparison_type: 'previous_month',
      created_at: new Date().toISOString(),
    });
  }

  return comparisons;
}

export function populateExecutiveMetrics(options: PopulateOptions): KPIMetric[] {
  return populateFinancialMetrics(options).filter(m => EXECUTIVE_METRICS.includes(m.metric_name));
}

export function validateMetricIntegrity(metrics: KPIMetric[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const revenue = metrics.find(m => m.metric_name === 'total_revenue')?.metric_value;
  const grossProfit = metrics.find(m => m.metric_name === 'gross_profit')?.metric_value;
  const netProfit = metrics.find(m => m.metric_name === 'net_profit')?.metric_value;
  const expenses = metrics.find(m => m.metric_name === 'total_expenses')?.metric_value;
  const cashOnHand = metrics.find(m => m.metric_name === 'cash_on_hand')?.metric_value;
  const burnRate = metrics.find(m => m.metric_name === 'burn_rate')?.metric_value;
  const runway = metrics.find(m => m.metric_name === 'runway_months')?.metric_value;

  if (revenue !== undefined && grossProfit !== undefined && grossProfit > revenue) {
    errors.push('Gross profit cannot exceed total revenue');
  }
  if (revenue !== undefined && netProfit !== undefined && netProfit > revenue) {
    errors.push('Net profit cannot exceed total revenue');
  }
  if (grossProfit !== undefined && netProfit !== undefined && netProfit > grossProfit) {
    errors.push('Net profit cannot exceed gross profit');
  }
  if (cashOnHand !== undefined && burnRate !== undefined && runway !== undefined && burnRate > 0) {
    const expectedRunway = cashOnHand / burnRate;
    if (Math.abs(expectedRunway - runway) > 0.5) {
      errors.push(`Runway (${runway}) inconsistent with cash/burn (expected ~${expectedRunway.toFixed(1)})`);
    }
  }

  for (const m of metrics) {
    const def = getMetricByName(m.metric_name);
    if (!def) {
      errors.push(`Unknown metric: ${m.metric_name}`);
      continue;
    }
    if (m.metric_unit !== def.metric_unit) {
      errors.push(`Unit mismatch for ${m.metric_name}: got ${m.metric_unit}, expected ${def.metric_unit}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
