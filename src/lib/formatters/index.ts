import { formatCurrency } from './currency';
import { formatPercent } from './percent';
import { formatNumber } from './number';
import { formatDays, formatMonths } from './duration';

export { formatCurrency } from './currency';
export { formatPercent } from './percent';
export { formatNumber, formatCompact } from './number';
export { formatDays, formatMonths } from './duration';

export function formatMetricValue(value: number, unit: string): string {
  switch (unit) {
    case 'currency': return formatCurrency(value);
    case 'percent': return formatPercent(value);
    case 'ratio': return formatPercent(value);
    case 'days': return formatDays(value);
    case 'months': return formatMonths(value);
    case 'count': return formatNumber(value);
    default: return formatNumber(value);
  }
}
