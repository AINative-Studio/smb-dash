import type { DashboardPeriod } from '@/types/periods';
import type { TrendSeries } from '@/types/trends';

export const mockPeriods: DashboardPeriod[] = [
  { id: 'p1', organizationId: 'org-1', periodType: 'monthly', periodStart: '2026-01-01', periodEnd: '2026-01-31', label: 'Jan 2026', isClosed: true },
  { id: 'p2', organizationId: 'org-1', periodType: 'monthly', periodStart: '2026-02-01', periodEnd: '2026-02-28', label: 'Feb 2026', isClosed: true },
  { id: 'p3', organizationId: 'org-1', periodType: 'monthly', periodStart: '2026-03-01', periodEnd: '2026-03-31', label: 'Mar 2026', isClosed: false },
];

export const mockQuarterlyPeriods: DashboardPeriod[] = [
  { id: 'q1', organizationId: 'org-1', periodType: 'quarterly', periodStart: '2026-01-01', periodEnd: '2026-03-31', label: 'Q1 2026', isClosed: false },
];

export const mockTrendRows = [
  { id: 't1', organization_id: 'org-1', metric_name: 'total_revenue', period_id: 'p1', metric_value: 100000, metric_unit: 'currency', series_key: null, created_at: '2026-01-31T00:00:00Z' },
  { id: 't2', organization_id: 'org-1', metric_name: 'total_revenue', period_id: 'p2', metric_value: 112000, metric_unit: 'currency', series_key: null, created_at: '2026-02-28T00:00:00Z' },
  { id: 't3', organization_id: 'org-1', metric_name: 'total_revenue', period_id: 'p3', metric_value: 125000, metric_unit: 'currency', series_key: null, created_at: '2026-03-31T00:00:00Z' },
  { id: 't4', organization_id: 'org-1', metric_name: 'net_profit', period_id: 'p1', metric_value: 18000, metric_unit: 'currency', series_key: null, created_at: '2026-01-31T00:00:00Z' },
  { id: 't5', organization_id: 'org-1', metric_name: 'net_profit', period_id: 'p2', metric_value: 20000, metric_unit: 'currency', series_key: null, created_at: '2026-02-28T00:00:00Z' },
  { id: 't6', organization_id: 'org-1', metric_name: 'net_profit', period_id: 'p3', metric_value: 22000, metric_unit: 'currency', series_key: null, created_at: '2026-03-31T00:00:00Z' },
];

export const mockOtherOrgTrendRows = [
  { id: 't7', organization_id: 'org-2', metric_name: 'total_revenue', period_id: 'p1', metric_value: 50000, metric_unit: 'currency', series_key: null, created_at: '2026-01-31T00:00:00Z' },
];

export const mockSparseTrendRows = [
  { id: 's1', organization_id: 'org-1', metric_name: 'total_revenue', period_id: 'p1', metric_value: 100000, metric_unit: 'currency', series_key: null, created_at: '2026-01-31T00:00:00Z' },
  { id: 's2', organization_id: 'org-1', metric_name: 'total_revenue', period_id: 'p3', metric_value: 125000, metric_unit: 'currency', series_key: null, created_at: '2026-03-31T00:00:00Z' },
];

export const mockRevenueSeries: TrendSeries = {
  metricName: 'total_revenue',
  displayName: 'Total Revenue',
  unit: 'currency',
  dataPoints: [
    { periodId: 'p1', label: 'Jan 2026', value: 100000, unit: 'currency' },
    { periodId: 'p2', label: 'Feb 2026', value: 112000, unit: 'currency' },
    { periodId: 'p3', label: 'Mar 2026', value: 125000, unit: 'currency' },
  ],
};

export const mockProfitSeries: TrendSeries = {
  metricName: 'net_profit',
  displayName: 'Net Profit',
  unit: 'currency',
  dataPoints: [
    { periodId: 'p1', label: 'Jan 2026', value: 18000, unit: 'currency' },
    { periodId: 'p2', label: 'Feb 2026', value: 20000, unit: 'currency' },
    { periodId: 'p3', label: 'Mar 2026', value: 22000, unit: 'currency' },
  ],
};

export const mockEmptySeries: TrendSeries = {
  metricName: 'total_revenue',
  displayName: 'Total Revenue',
  unit: 'currency',
  dataPoints: [],
};
