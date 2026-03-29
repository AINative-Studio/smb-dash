export function KPICardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[#2D333B] bg-[#161B22] p-5">
      <div className="h-4 w-24 rounded bg-gray-700" />
      <div className="mt-3 h-8 w-32 rounded bg-gray-700" />
      <div className="mt-3 h-5 w-16 rounded-full bg-gray-700" />
    </div>
  );
}

export function KPICardSkeletonGrid({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>
  );
}
