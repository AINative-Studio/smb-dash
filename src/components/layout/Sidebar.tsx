'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Executive', icon: '📊' },
  { href: '/revenue', label: 'Revenue', icon: '💰' },
  { href: '/expenses', label: 'Expenses', icon: '📉' },
  { href: '/cashflow', label: 'Cash Flow', icon: '💵' },
  { href: '/ar-ap', label: 'AR / AP', icon: '📋' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-[#161B22] p-2 text-white md:hidden"
        aria-label="Toggle navigation"
      >
        {collapsed ? '✕' : '☰'}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-[#0D1117] border-r border-[#2D333B] transition-transform duration-200 ${
          collapsed ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex h-16 items-center px-6 border-b border-[#2D333B]">
          <span className="text-lg font-bold text-white">KPI Dashboard</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCollapsed(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#4B6FED]/10 text-[#4B6FED]'
                    : 'text-gray-400 hover:bg-[#161B22] hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
