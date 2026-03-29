interface KPIEmptyStateProps {
  message?: string;
  actionText?: string;
}

export function KPIEmptyState({ message = 'No KPI data available', actionText }: KPIEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2D333B] bg-[#161B22]/50 px-6 py-16 text-center">
      <span className="text-4xl mb-4">📊</span>
      <p className="text-gray-400 text-sm">{message}</p>
      {actionText && <p className="mt-2 text-xs text-gray-500">{actionText}</p>}
    </div>
  );
}
