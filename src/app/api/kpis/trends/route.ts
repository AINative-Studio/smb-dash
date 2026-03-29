import { NextRequest, NextResponse } from 'next/server';
import type { TrendSeries } from '@/lib/types/trend';

const MONTHS = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'];

function mockTrend(metricName: string, unit: string, baseValue: number, variance: number): TrendSeries {
  return {
    metric_name: metricName,
    metric_unit: unit,
    series_key: null,
    points: MONTHS.map((label, i) => ({
      period_id: `p-${i}`,
      period_label: label,
      period_start: `2025-${String(10 + i).padStart(2, '0')}-01`,
      metric_value: Math.round(baseValue + (Math.random() - 0.3) * variance * (i + 1)),
    })),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organization_id');
  if (!orgId) return NextResponse.json({ error: 'organization_id is required' }, { status: 400 });

  const metrics = searchParams.get('metrics')?.split(',') ?? ['total_revenue', 'net_profit', 'total_expenses', 'net_cash_flow'];

  const seriesMap: Record<string, () => TrendSeries> = {
    total_revenue: () => mockTrend('total_revenue', 'currency', 350000, 25000),
    net_profit: () => mockTrend('net_profit', 'currency', 80000, 15000),
    total_expenses: () => mockTrend('total_expenses', 'currency', 270000, 20000),
    net_cash_flow: () => mockTrend('net_cash_flow', 'currency', 30000, 15000),
    gross_profit: () => mockTrend('gross_profit', 'currency', 150000, 20000),
    cash_on_hand: () => mockTrend('cash_on_hand', 'currency', 280000, 30000),
  };

  const series = metrics
    .filter(m => m in seriesMap)
    .map(m => seriesMap[m]());

  return NextResponse.json({ series, organization_id: orgId });
}
