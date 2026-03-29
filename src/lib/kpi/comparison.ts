import type { ComparisonType } from '@/lib/types/comparison';
import type { DeltaResult } from '@/lib/types/comparison';

export function getComparisonPeriod(
  currentStart: string,
  currentEnd: string,
  comparisonType: ComparisonType
): { start: string; end: string } {
  const s = new Date(currentStart);
  const e = new Date(currentEnd);

  switch (comparisonType) {
    case 'previous_period':
    case 'previous_month': {
      const duration = e.getTime() - s.getTime();
      const newEnd = new Date(s.getTime() - 1);
      const newStart = new Date(newEnd.getTime() - duration);
      return { start: newStart.toISOString().split('T')[0], end: newEnd.toISOString().split('T')[0] };
    }
    case 'previous_year': {
      const newStart = new Date(s);
      newStart.setFullYear(newStart.getFullYear() - 1);
      const newEnd = new Date(e);
      newEnd.setFullYear(newEnd.getFullYear() - 1);
      return { start: newStart.toISOString().split('T')[0], end: newEnd.toISOString().split('T')[0] };
    }
  }
}

export function calculateDelta(current: number, previous: number): DeltaResult {
  const absolute = current - previous;
  const percent = previous !== 0 ? ((current - previous) / Math.abs(previous)) * 100 : null;
  return { absolute, percent };
}

export function formatDelta(delta: number, unit: string): string {
  const sign = delta > 0 ? '+' : '';
  switch (unit) {
    case 'currency':
      return `${sign}$${Math.abs(delta).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    case 'percent':
      return `${sign}${delta.toFixed(1)}%`;
    case 'days':
      return `${sign}${delta.toFixed(0)} days`;
    case 'months':
      return `${sign}${delta.toFixed(1)} months`;
    default:
      return `${sign}${delta.toLocaleString('en-US')}`;
  }
}
