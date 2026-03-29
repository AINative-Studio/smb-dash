import type { DashboardPeriod, PeriodType } from '@/lib/types/period';

function pad(n: number) { return String(n).padStart(2, '0'); }
function toDateString(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function generateMonthlyPeriods(orgId: string, startYear: number, startMonth: number, count: number): DashboardPeriod[] {
  const periods: DashboardPeriod[] = [];
  let y = startYear, m = startMonth;

  for (let i = 0; i < count; i++) {
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);
    const now = new Date();
    const isClosed = end < now;

    periods.push({
      id: `period-monthly-${y}-${pad(m + 1)}`,
      organization_id: orgId,
      period_type: 'monthly',
      period_start: toDateString(start),
      period_end: toDateString(end),
      label: `${MONTHS[m]} ${y}`,
      is_closed: isClosed,
      created_at: new Date().toISOString(),
    });

    m++;
    if (m > 11) { m = 0; y++; }
  }
  return periods;
}

export function generateQuarterlyPeriods(orgId: string, startYear: number, count: number): DashboardPeriod[] {
  const periods: DashboardPeriod[] = [];
  let y = startYear, q = 0;

  for (let i = 0; i < count; i++) {
    const startMonth = q * 3;
    const start = new Date(y, startMonth, 1);
    const end = new Date(y, startMonth + 3, 0);
    const now = new Date();

    periods.push({
      id: `period-quarterly-${y}-Q${q + 1}`,
      organization_id: orgId,
      period_type: 'quarterly',
      period_start: toDateString(start),
      period_end: toDateString(end),
      label: `Q${q + 1} ${y}`,
      is_closed: end < now,
      created_at: new Date().toISOString(),
    });

    q++;
    if (q > 3) { q = 0; y++; }
  }
  return periods;
}

export function generateYearlyPeriods(orgId: string, startYear: number, count: number): DashboardPeriod[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const year = startYear + i;
    return {
      id: `period-yearly-${year}`,
      organization_id: orgId,
      period_type: 'yearly' as PeriodType,
      period_start: `${year}-01-01`,
      period_end: `${year}-12-31`,
      label: String(year),
      is_closed: year < now.getFullYear(),
      created_at: new Date().toISOString(),
    };
  });
}

export function generateAllPeriods(orgId: string): DashboardPeriod[] {
  return [
    ...generateMonthlyPeriods(orgId, 2025, 0, 18),
    ...generateQuarterlyPeriods(orgId, 2025, 8),
    ...generateYearlyPeriods(orgId, 2025, 3),
  ];
}
