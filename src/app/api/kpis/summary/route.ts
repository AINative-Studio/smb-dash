import { NextRequest, NextResponse } from 'next/server';
import type { KPIMetric } from '@/lib/types/kpi';

const MOCK_METRICS: KPIMetric[] = [
  { metric_name: 'total_revenue', metric_value: 425000, metric_unit: 'currency', period_id: 'p1', delta_percent: 11.8, delta_absolute: 45000, comparison_type: 'previous_month' },
  { metric_name: 'gross_profit', metric_value: 180000, metric_unit: 'currency', period_id: 'p1', delta_percent: 9.1, delta_absolute: 15000, comparison_type: 'previous_month' },
  { metric_name: 'net_profit', metric_value: 95000, metric_unit: 'currency', period_id: 'p1', delta_percent: -6.9, delta_absolute: -7000, comparison_type: 'previous_month' },
  { metric_name: 'cash_on_hand', metric_value: 312000, metric_unit: 'currency', period_id: 'p1', delta_percent: 4.7, delta_absolute: 14000, comparison_type: 'previous_month' },
  { metric_name: 'net_cash_flow', metric_value: 45000, metric_unit: 'currency', period_id: 'p1', delta_percent: 18.4, delta_absolute: 7000, comparison_type: 'previous_month' },
  { metric_name: 'ar_balance', metric_value: 78500, metric_unit: 'currency', period_id: 'p1', delta_percent: 9.0, delta_absolute: 6500, comparison_type: 'previous_month' },
  { metric_name: 'ap_balance', metric_value: 34200, metric_unit: 'currency', period_id: 'p1', delta_percent: -10.2, delta_absolute: -3900, comparison_type: 'previous_month' },
  { metric_name: 'burn_rate', metric_value: 52000, metric_unit: 'currency', period_id: 'p1', delta_percent: 8.3, delta_absolute: 4000, comparison_type: 'previous_month' },
  { metric_name: 'runway_months', metric_value: 6.0, metric_unit: 'months', period_id: 'p1', delta_percent: -3.2, delta_absolute: -0.2, comparison_type: 'previous_month' },
];

export async function GET(request: NextRequest) {
  const orgId = new URL(request.url).searchParams.get('organization_id');
  if (!orgId) return NextResponse.json({ error: 'organization_id is required' }, { status: 400 });
  return NextResponse.json({ metrics: MOCK_METRICS, period_label: 'Mar 2026', organization_id: orgId });
}
