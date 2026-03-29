import { NextRequest, NextResponse } from 'next/server';

const MOCK_COMPARISONS = [
  { metric_name: 'total_revenue', current_value: 425000, comparison_value: 380000, absolute_delta: 45000, percent_delta: 11.8, comparison_type: 'previous_month' },
  { metric_name: 'gross_profit', current_value: 180000, comparison_value: 165000, absolute_delta: 15000, percent_delta: 9.1, comparison_type: 'previous_month' },
  { metric_name: 'net_profit', current_value: 95000, comparison_value: 102000, absolute_delta: -7000, percent_delta: -6.9, comparison_type: 'previous_month' },
  { metric_name: 'cash_on_hand', current_value: 312000, comparison_value: 298000, absolute_delta: 14000, percent_delta: 4.7, comparison_type: 'previous_month' },
  { metric_name: 'net_cash_flow', current_value: 45000, comparison_value: 38000, absolute_delta: 7000, percent_delta: 18.4, comparison_type: 'previous_month' },
  { metric_name: 'ar_balance', current_value: 78500, comparison_value: 72000, absolute_delta: 6500, percent_delta: 9.0, comparison_type: 'previous_month' },
  { metric_name: 'ap_balance', current_value: 34200, comparison_value: 38100, absolute_delta: -3900, percent_delta: -10.2, comparison_type: 'previous_month' },
  { metric_name: 'burn_rate', current_value: 52000, comparison_value: 48000, absolute_delta: 4000, percent_delta: 8.3, comparison_type: 'previous_month' },
  { metric_name: 'runway_months', current_value: 6.0, comparison_value: 6.2, absolute_delta: -0.2, percent_delta: -3.2, comparison_type: 'previous_month' },
];

export async function GET(request: NextRequest) {
  const orgId = new URL(request.url).searchParams.get('organization_id');
  if (!orgId) return NextResponse.json({ error: 'organization_id is required' }, { status: 400 });
  return NextResponse.json(MOCK_COMPARISONS.map((c, i) => ({ id: `comp-${i}`, organization_id: orgId, ...c })));
}
