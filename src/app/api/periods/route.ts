import { NextRequest, NextResponse } from 'next/server';
import type { DashboardPeriod } from '@/lib/types/period';
import { getPeriodRange } from '@/lib/utils/period';

export async function GET(request: NextRequest) {
  const orgId = new URL(request.url).searchParams.get('organization_id');
  if (!orgId) return NextResponse.json({ error: 'organization_id is required' }, { status: 400 });

  const now = new Date();
  const keys = ['current_month', 'last_month', 'current_quarter', 'last_quarter', 'year_to_date', 'last_12_months'] as const;

  const periods: DashboardPeriod[] = keys.map(key => {
    const range = getPeriodRange(key, now);
    return {
      id: `period-${orgId}-${key}`,
      organization_id: orgId,
      period_type: range.period_type,
      period_start: range.period_start,
      period_end: range.period_end,
      label: range.label,
      is_closed: key === 'last_month' || key === 'last_quarter',
      created_at: now.toISOString(),
    };
  });

  return NextResponse.json(periods);
}
