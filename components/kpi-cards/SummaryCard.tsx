import React from 'react';
import type { SummaryCard as SummaryCardData } from '@/types/summary';

interface SummaryCardProps {
  card: SummaryCardData;
  isLoading?: boolean;
}

function formatValue(value: number, unit: string): string {
  if (unit === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }
  return String(value);
}

export function SummaryCard({ card, isLoading }: SummaryCardProps) {
  if (isLoading) {
    return (
      <div data-testid="summary-card-loading" aria-busy="true">
        <div className="animate-pulse bg-gray-200 h-4 w-32 rounded mb-2" />
        <div className="animate-pulse bg-gray-200 h-8 w-24 rounded" />
      </div>
    );
  }

  const { displayName, value, unit, delta } = card;

  let deltaElement: React.ReactNode = null;

  if (delta) {
    const isPositive = delta.absoluteDelta > 0;
    const isNegative = delta.absoluteDelta < 0;
    const absPercent = delta.percentDelta !== null ? Math.abs(delta.percentDelta) : null;

    if (isPositive) {
      deltaElement = (
        <span data-testid="delta-up" className="text-green-600 flex items-center gap-1 text-sm">
          <span aria-hidden="true">&#x2191;</span>
          {absPercent !== null && (
            <span data-testid="delta-percent">{absPercent}%</span>
          )}
        </span>
      );
    } else if (isNegative) {
      deltaElement = (
        <span data-testid="delta-down" className="text-red-600 flex items-center gap-1 text-sm">
          <span aria-hidden="true">&#x2193;</span>
          {absPercent !== null && (
            <span data-testid="delta-percent">{absPercent}%</span>
          )}
        </span>
      );
    }
  }

  return (
    <div data-testid="summary-card">
      <p className="text-sm text-gray-500">{displayName}</p>
      <p data-testid="summary-card-value" className="text-2xl font-bold">
        {formatValue(value, unit)}
      </p>
      <p data-testid="summary-card-unit" className="text-xs text-gray-400">
        {unit}
      </p>
      {deltaElement}
    </div>
  );
}
