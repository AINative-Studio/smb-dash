'use client';

import { formatMetricValue } from '@/lib/formatters';

interface ComparisonTooltipProps {
  currentValue: number;
  previousValue: number;
  unit: string;
  comparisonLabel: string;
  children: React.ReactNode;
}

export function ComparisonTooltip({ currentValue, previousValue, unit, comparisonLabel, children }: ComparisonTooltipProps) {
  const absoluteDelta = currentValue - previousValue;

  return (
    <div className="group relative inline-block">
      {children}
      <div className="invisible absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg bg-[#0D1117] border border-[#2D333B] px-3 py-2 text-xs shadow-lg group-hover:visible whitespace-nowrap">
        <div className="text-gray-400 mb-1">vs {comparisonLabel}</div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Current:</span>
          <span className="text-white font-medium">{formatMetricValue(currentValue, unit)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Previous:</span>
          <span className="text-white font-medium">{formatMetricValue(previousValue, unit)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-[#2D333B] mt-1 pt-1">
          <span className="text-gray-500">Change:</span>
          <span className={absoluteDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}>
            {absoluteDelta >= 0 ? '+' : ''}{formatMetricValue(absoluteDelta, unit)}
          </span>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2D333B]" />
      </div>
    </div>
  );
}
