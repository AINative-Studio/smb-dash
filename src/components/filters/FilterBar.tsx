'use client';

import { FilterChip } from './FilterChip';

interface ActiveFilterDisplay {
  type: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface FilterBarProps {
  filters: ActiveFilterDisplay[];
  onClearAll: () => void;
}

export function FilterBar({ filters, onClearAll }: FilterBarProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      {filters.map(f => (
        <FilterChip key={f.type} label={f.label} value={f.value} onRemove={f.onRemove} />
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-gray-500 hover:text-white transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}
