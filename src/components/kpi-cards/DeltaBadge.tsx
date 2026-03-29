'use client';

import { getDeltaDirection, getDeltaSentiment, formatDeltaPercent } from '@/lib/kpi/deltaUtils';

interface DeltaBadgeProps {
  delta: number | null;
  metricName: string;
  size?: 'sm' | 'md';
}

export function DeltaBadge({ delta, metricName, size = 'sm' }: DeltaBadgeProps) {
  const direction = getDeltaDirection(delta);
  const sentiment = getDeltaSentiment(metricName, delta);

  const colorMap = {
    good: 'text-emerald-400 bg-emerald-400/10',
    bad: 'text-red-400 bg-red-400/10',
    neutral: 'text-gray-400 bg-gray-400/10',
  };

  const sizeMap = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  const arrow = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '—';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${colorMap[sentiment]} ${sizeMap[size]}`}>
      <span className="text-[10px]">{arrow}</span>
      {formatDeltaPercent(delta)}
    </span>
  );
}
