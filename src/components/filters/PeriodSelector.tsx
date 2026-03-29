'use client';

import type { PredefinedPeriodKey } from '@/lib/types/period';

const PERIOD_OPTIONS: { key: PredefinedPeriodKey; label: string }[] = [
  { key: 'current_month', label: 'Current Month' },
  { key: 'last_month', label: 'Last Month' },
  { key: 'current_quarter', label: 'Current Quarter' },
  { key: 'last_quarter', label: 'Last Quarter' },
  { key: 'year_to_date', label: 'Year to Date' },
  { key: 'last_12_months', label: 'Last 12 Months' },
];

interface PeriodSelectorProps {
  selectedKey: PredefinedPeriodKey;
  onChange: (key: PredefinedPeriodKey) => void;
  isLoading?: boolean;
  className?: string;
}

export function PeriodSelector({ selectedKey, onChange, isLoading, className = '' }: PeriodSelectorProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <label className="text-sm font-medium text-gray-500">Period</label>
      <select
        value={selectedKey}
        onChange={e => onChange(e.target.value as PredefinedPeriodKey)}
        disabled={isLoading}
        className="appearance-none rounded-lg border border-[#4B6FED] bg-white px-3 py-1.5 pr-8 text-sm font-medium text-[#4B6FED] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4B6FED]/50 disabled:opacity-50"
      >
        {PERIOD_OPTIONS.map(opt => (
          <option key={opt.key} value={opt.key}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
