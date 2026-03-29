'use client';

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4B6FED]/10 border border-[#4B6FED]/20 px-3 py-1 text-xs font-medium text-[#4B6FED]">
      {label}: {value}
      <button onClick={onRemove} className="hover:text-white transition-colors" aria-label={`Remove ${label} filter`}>
        ✕
      </button>
    </span>
  );
}
