export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-3' };
  return (
    <div className={`animate-spin rounded-full border-gray-600 border-t-[#4B6FED] ${sizeMap[size]}`} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <LoadingSpinner size="lg" />
      {message && <p className="mt-4 text-sm text-gray-400">{message}</p>}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[#2D333B] bg-[#161B22] p-5">
      <div className="h-4 w-24 rounded bg-gray-700 mb-3" />
      <div className="h-8 w-32 rounded bg-gray-700 mb-3" />
      <div className="h-5 w-16 rounded-full bg-gray-700" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse rounded-xl border border-[#2D333B] overflow-hidden">
      <div className="bg-[#161B22] px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-gray-700 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-4 py-3 flex gap-4 border-t border-[#2D333B]">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 rounded bg-gray-800 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[#2D333B] bg-[#161B22] p-6">
      <div className="h-4 w-32 rounded bg-gray-700 mb-6" />
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-1 rounded-t bg-gray-700" style={{ height: `${30 + Math.random() * 70}%` }} />
        ))}
      </div>
    </div>
  );
}
