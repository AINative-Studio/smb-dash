interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = '📭', title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2D333B] bg-[#161B22]/50 px-8 py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-md">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg bg-[#4B6FED] px-4 py-2 text-sm font-medium text-white hover:bg-[#3B5FDD] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function NoDataState({ context }: { context: string }) {
  return <EmptyState icon="📊" title={`No ${context} data available`} description="Data will appear once your QuickBooks sync is complete." />;
}

export function NoComparisonState() {
  return <EmptyState icon="📈" title="No comparison data" description="Select a different period or wait for more data to accumulate." />;
}

export function NoBreakdownState({ type }: { type: string }) {
  return <EmptyState icon="📋" title={`No ${type} breakdown available`} description="Breakdown data will populate after the next sync cycle." />;
}

export function NoFilterResultsState({ onClear }: { onClear?: () => void }) {
  return <EmptyState icon="🔍" title="No results match your filters" description="Try adjusting or clearing your filters." actionLabel={onClear ? 'Clear Filters' : undefined} onAction={onClear} />;
}
