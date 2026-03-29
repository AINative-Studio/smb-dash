'use client';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#2D333B] bg-[#161B22] px-6">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-400">Acme Corp</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500">Mar 2026</span>
        <div className="h-8 w-8 rounded-full bg-[#4B6FED] flex items-center justify-center text-xs font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}
