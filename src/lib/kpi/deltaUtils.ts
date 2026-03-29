import { getSentiment } from './sentimentConfig';
import type { Sentiment } from './sentimentConfig';

export type DeltaDirection = 'up' | 'down' | 'neutral';

export function getDeltaDirection(delta: number | null): DeltaDirection {
  if (delta === null || delta === 0) return 'neutral';
  return delta > 0 ? 'up' : 'down';
}

export function getDeltaSentiment(metricName: string, delta: number | null): Sentiment {
  return getSentiment(metricName, delta);
}

export function formatDeltaPercent(value: number | null): string {
  if (value === null) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function formatDeltaAbsolute(value: number | null, unit: string): string {
  if (value === null) return '—';
  const sign = value > 0 ? '+' : '';
  switch (unit) {
    case 'currency': {
      const abs = Math.abs(value);
      const formatted = abs >= 1_000_000
        ? `$${(abs / 1_000_000).toFixed(1)}M`
        : abs >= 1_000
        ? `$${(abs / 1_000).toFixed(1)}K`
        : `$${abs.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
      return `${sign}${value < 0 ? '-' : ''}${formatted.replace('-', '')}`;
    }
    case 'percent':
      return `${sign}${value.toFixed(1)}pp`;
    case 'days':
      return `${sign}${value.toFixed(0)} days`;
    case 'months':
      return `${sign}${value.toFixed(1)} mo`;
    default:
      return `${sign}${value.toLocaleString('en-US')}`;
  }
}
