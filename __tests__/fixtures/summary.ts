import type { SummaryCard } from '@/types/summary';

export const mockCashOnHandCard: SummaryCard = {
  metricName: 'cash_on_hand',
  displayName: 'Cash on Hand',
  value: 250000,
  unit: 'currency',
  delta: {
    absoluteDelta: 15000,
    percentDelta: 6.38,
    comparisonType: 'prior_period',
  },
};

export const mockRunwayCard: SummaryCard = {
  metricName: 'runway_months',
  displayName: 'Runway',
  value: 14,
  unit: 'months',
  delta: {
    absoluteDelta: -2,
    percentDelta: -12.5,
    comparisonType: 'prior_period',
  },
};

export const mockNetCashFlowCard: SummaryCard = {
  metricName: 'net_cash_flow',
  displayName: 'Net Cash Flow',
  value: 32000,
  unit: 'currency',
};

export const mockArBalanceCard: SummaryCard = {
  metricName: 'ar_balance',
  displayName: 'AR Balance',
  value: 87500,
  unit: 'currency',
  delta: {
    absoluteDelta: -5000,
    percentDelta: -5.41,
    comparisonType: 'prior_period',
  },
};

export const mockApBalanceCard: SummaryCard = {
  metricName: 'ap_balance',
  displayName: 'AP Balance',
  value: 43200,
  unit: 'currency',
  delta: {
    absoluteDelta: 3200,
    percentDelta: 8.0,
    comparisonType: 'prior_period',
  },
};

export const mockSummaryMetricRows = [
  {
    id: 'fm1',
    organization_id: 'org-1',
    period_id: 'p3',
    metric_name: 'cash_on_hand',
    metric_value: 250000,
    metric_unit: 'currency',
  },
  {
    id: 'fm2',
    organization_id: 'org-1',
    period_id: 'p3',
    metric_name: 'runway_months',
    metric_value: 14,
    metric_unit: 'months',
  },
  {
    id: 'fm3',
    organization_id: 'org-1',
    period_id: 'p3',
    metric_name: 'net_cash_flow',
    metric_value: 32000,
    metric_unit: 'currency',
  },
  {
    id: 'fm4',
    organization_id: 'org-1',
    period_id: 'p3',
    metric_name: 'ar_balance',
    metric_value: 87500,
    metric_unit: 'currency',
  },
  {
    id: 'fm5',
    organization_id: 'org-1',
    period_id: 'p3',
    metric_name: 'ap_balance',
    metric_value: 43200,
    metric_unit: 'currency',
  },
];

export const mockOtherOrgMetricRows = [
  {
    id: 'fm6',
    organization_id: 'org-2',
    period_id: 'p3',
    metric_name: 'cash_on_hand',
    metric_value: 999999,
    metric_unit: 'currency',
  },
];

export const mockComparisonRows = [
  {
    id: 'cmp1',
    organization_id: 'org-1',
    metric_name: 'cash_on_hand',
    current_period_id: 'p3',
    comparison_period_id: 'p2',
    current_value: 250000,
    comparison_value: 235000,
    absolute_delta: 15000,
    percent_delta: 6.38,
    comparison_type: 'prior_period',
  },
  {
    id: 'cmp2',
    organization_id: 'org-1',
    metric_name: 'runway_months',
    current_period_id: 'p3',
    comparison_period_id: 'p2',
    current_value: 14,
    comparison_value: 16,
    absolute_delta: -2,
    percent_delta: -12.5,
    comparison_type: 'prior_period',
  },
  {
    id: 'cmp3',
    organization_id: 'org-1',
    metric_name: 'ar_balance',
    current_period_id: 'p3',
    comparison_period_id: 'p2',
    current_value: 87500,
    comparison_value: 92500,
    absolute_delta: -5000,
    percent_delta: -5.41,
    comparison_type: 'prior_period',
  },
  {
    id: 'cmp4',
    organization_id: 'org-1',
    metric_name: 'ap_balance',
    current_period_id: 'p3',
    comparison_period_id: 'p2',
    current_value: 43200,
    comparison_value: 40000,
    absolute_delta: 3200,
    percent_delta: 8.0,
    comparison_type: 'prior_period',
  },
];
