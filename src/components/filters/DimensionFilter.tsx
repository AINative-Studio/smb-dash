'use client';

interface DimensionFilterProps {
  label: string;
  options: { id: string; name: string }[];
  value: string | null;
  onChange: (id: string) => void;
  onClear: () => void;
}

export function DimensionFilter({ label, options, value, onChange, onClear }: DimensionFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={value ?? ''}
        onChange={e => e.target.value ? onChange(e.target.value) : onClear()}
        className="rounded-lg border border-[#2D333B] bg-[#161B22] px-3 py-1.5 text-sm text-gray-300 focus:border-[#4B6FED] focus:outline-none"
      >
        <option value="">All {label}</option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
    </div>
  );
}
