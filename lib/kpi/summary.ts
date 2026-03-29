import type { ZeroDBClient } from '@/lib/zerodb/client';
import type { SummaryApiRequest, SummaryCard } from '@/types/summary';

interface FinancialMetricRow {
  id: string;
  organization_id: string;
  period_id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
}

interface KpiComparisonRow {
  id: string;
  organization_id: string;
  metric_name: string;
  current_period_id: string;
  comparison_period_id: string;
  current_value: number;
  comparison_value: number;
  absolute_delta: number;
  percent_delta: number | null;
  comparison_type: string;
}

const DISPLAY_NAMES: Record<string, string> = {
  net_cash_flow: 'Net Cash Flow',
  cash_on_hand: 'Cash on Hand',
  cash_inflow: 'Cash Inflow',
  cash_outflow: 'Cash Outflow',
  runway_months: 'Runway',
  ar_balance: 'AR Balance',
  ap_balance: 'AP Balance',
  total_revenue: 'Total Revenue',
  net_profit: 'Net Profit',
  gross_profit: 'Gross Profit',
  total_expenses: 'Total Expenses',
  burn_rate: 'Burn Rate',
};

function toDisplayName(metricName: string): string {
  return (
    DISPLAY_NAMES[metricName] ??
    metricName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export async function fetchSummaryCards(
  client: ZeroDBClient,
  request: SummaryApiRequest
): Promise<SummaryCard[]> {
  const { organizationId, metricNames, includeComparison } = request;

  const metricResult = await client.query<FinancialMetricRow>('fact_financial_metrics', {
    organization_id: organizationId,
    metric_name: metricNames,
  });

  if (metricResult.rows.length === 0) {
    return [];
  }

  let comparisonMap = new Map<string, KpiComparisonRow>();

  if (includeComparison) {
    const comparisonResult = await client.query<KpiComparisonRow>('fact_kpi_comparisons', {
      organization_id: organizationId,
      metric_name: metricNames,
    });
    for (const row of comparisonResult.rows) {
      comparisonMap.set(row.metric_name, row);
    }
  }

  // Build a map of latest metric value per metric name
  const metricMap = new Map<string, FinancialMetricRow>();
  for (const row of metricResult.rows) {
    metricMap.set(row.metric_name, row);
  }

  return metricNames
    .filter((name) => metricMap.has(name))
    .map((name): SummaryCard => {
      const metric = metricMap.get(name)!;
      const comparison = comparisonMap.get(name);

      const card: SummaryCard = {
        metricName: name,
        displayName: toDisplayName(name),
        value: metric.metric_value,
        unit: metric.metric_unit,
      };

      if (comparison) {
        card.delta = {
          absoluteDelta: comparison.absolute_delta,
          percentDelta: comparison.percent_delta,
          comparisonType: comparison.comparison_type,
        };
      }

      return card;
    });
}
