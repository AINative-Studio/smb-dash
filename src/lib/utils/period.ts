import type { DashboardPeriod, PeriodRange, PredefinedPeriodKey } from '@/lib/types/period';

function pad(n: number) { return String(n).padStart(2, '0'); }
function toDateString(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function startOfMonth(y: number, m: number) { return new Date(y, m, 1); }
function endOfMonth(y: number, m: number) { return new Date(y, m + 1, 0); }
function quarterOf(m: number) { return Math.floor(m / 3); }
function quarterStartMonth(q: number) { return q * 3; }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getPeriodRange(key: PredefinedPeriodKey, ref: Date = new Date()): PeriodRange {
  const y = ref.getFullYear(), m = ref.getMonth();
  switch (key) {
    case 'current_month':
      return { period_start: toDateString(startOfMonth(y, m)), period_end: toDateString(endOfMonth(y, m)), period_type: 'monthly', label: `${MONTHS[m]} ${y}` };
    case 'last_month': {
      const pm = m === 0 ? 11 : m - 1, py = m === 0 ? y - 1 : y;
      return { period_start: toDateString(startOfMonth(py, pm)), period_end: toDateString(endOfMonth(py, pm)), period_type: 'monthly', label: `${MONTHS[pm]} ${py}` };
    }
    case 'current_quarter': {
      const q = quarterOf(m), qs = quarterStartMonth(q);
      return { period_start: toDateString(startOfMonth(y, qs)), period_end: toDateString(endOfMonth(y, qs + 2)), period_type: 'quarterly', label: `Q${q + 1} ${y}` };
    }
    case 'last_quarter': {
      let pq = quarterOf(m) - 1, pqy = y; if (pq < 0) { pq = 3; pqy = y - 1; }
      const pqs = quarterStartMonth(pq);
      return { period_start: toDateString(startOfMonth(pqy, pqs)), period_end: toDateString(endOfMonth(pqy, pqs + 2)), period_type: 'quarterly', label: `Q${pq + 1} ${pqy}` };
    }
    case 'year_to_date':
      return { period_start: toDateString(new Date(y, 0, 1)), period_end: toDateString(ref), period_type: 'yearly', label: `YTD ${y}` };
    case 'last_12_months':
      return { period_start: toDateString(new Date(y - 1, m + 1, 1)), period_end: toDateString(ref), period_type: 'monthly', label: 'Last 12 Months' };
  }
}

export function formatPeriodLabel(period: DashboardPeriod): string {
  if (period.label) return period.label;
  const s = new Date(period.period_start);
  switch (period.period_type) {
    case 'monthly': return `${MONTHS[s.getMonth()]} ${s.getFullYear()}`;
    case 'quarterly': return `Q${quarterOf(s.getMonth()) + 1} ${s.getFullYear()}`;
    case 'yearly': return String(s.getFullYear());
    default: return `${period.period_start} – ${period.period_end}`;
  }
}

export function comparePeriods(a: DashboardPeriod, b: DashboardPeriod): number {
  return a.period_start < b.period_start ? -1 : a.period_start > b.period_start ? 1 : 0;
}

export function matchPeriod(periods: DashboardPeriod[], range: PeriodRange): DashboardPeriod | null {
  return periods.find(p => p.period_start === range.period_start && p.period_end === range.period_end) ?? null;
}
