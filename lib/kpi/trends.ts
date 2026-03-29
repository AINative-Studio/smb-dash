import type { ZeroDBClient } from '@/lib/zerodb/client';
import type { TrendsApiRequest, TrendSeries, TrendDataPoint } from '@/types/trends';

interface TrendRow {
  id: string;
  organization_id: string;
  metric_name: string;
  period_id: string;
  metric_value: number;
  metric_unit: string;
  series_key: string | null;
  created_at: string;
}

interface PeriodRow {
  id: string;
  organization_id: string;
  period_type: string;
  period_start: string;
  period_end: string;
  label: string;
  is_closed: boolean;
}

const DISPLAY_NAMES: Record<string, string> = {
  total_revenue: 'Total Revenue',
  net_profit: 'Net Profit',
  gross_profit: 'Gross Profit',
  net_cash_flow: 'Net Cash Flow',
  cash_on_hand: 'Cash on Hand',
  total_expenses: 'Total Expenses',
  burn_rate: 'Burn Rate',
  runway_months: 'Runway',
};

function toDisplayName(metricName: string): string {
  return DISPLAY_NAMES[metricName] ?? metricName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function fetchTrendSeries(
  client: ZeroDBClient,
  request: TrendsApiRequest
): Promise<TrendSeries[]> {
  const { organizationId, metricNames, periodType } = request;

  const [trendResult, periodResult] = await Promise.all([
    client.query<TrendRow>('fact_metric_trends', {
      organization_id: organizationId,
      metric_name: metricNames,
    }),
    client.query<PeriodRow>('dashboard_periods', {
      organization_id: organizationId,
      period_type: periodType,
    }),
  ]);

  const periodMap = new Map<string, PeriodRow>();
  for (const p of periodResult.rows) {
    periodMap.set(p.id, p);
  }

  // Sort periods by start date for ordering
  const sortedPeriodIds = periodResult.rows
    .sort((a, b) => a.period_start.localeCompare(b.period_start))
    .map((p) => p.id);

  // Group trend rows by metric
  const grouped = new Map<string, TrendRow[]>();
  for (const row of trendResult.rows) {
    const existing = grouped.get(row.metric_name) ?? [];
    existing.push(row);
    grouped.set(row.metric_name, existing);
  }

  return metricNames.map((metricName) => {
    const rows = grouped.get(metricName) ?? [];
    const unit = rows[0]?.metric_unit ?? 'currency';

    // Order data points by period start date
    const dataPoints: TrendDataPoint[] = sortedPeriodIds
      .map((periodId) => {
        const row = rows.find((r) => r.period_id === periodId);
        if (!row) return null;
        const period = periodMap.get(periodId);
        return {
          periodId,
          label: period?.label ?? periodId,
          value: row.metric_value,
          unit: row.metric_unit,
        };
      })
      .filter((dp): dp is TrendDataPoint => dp !== null);

    return {
      metricName,
      displayName: toDisplayName(metricName),
      unit,
      dataPoints,
    };
  });
}
