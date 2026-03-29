'use client';

import { useState } from 'react';
import type { AgingBreakdownRow, BalanceType } from '@/lib/types/aging';
import { AGING_BUCKET_LABELS } from '@/lib/types/aging';
import { formatCurrency } from '@/lib/formatters/currency';

interface AgingTableProps {
  rows: AgingBreakdownRow[];
  balanceType: BalanceType;
  onRowClick?: (row: AgingBreakdownRow) => void;
}

export function AgingTable({ rows, balanceType, onRowClick }: AgingTableProps) {
  const [sortBy, setSortBy] = useState<string>('total_balance');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const nameKey = balanceType === 'ar' ? 'customer_name' : 'vendor_name';

  const sorted = [...rows].sort((a: any, b: any) => {
    const va = a[sortBy] ?? 0;
    const vb = b[sortBy] ?? 0;
    return sortDir === 'asc' ? va - vb : vb - va;
  });

  function handleSort(key: string) {
    if (sortBy === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  }

  const sortIndicator = (key: string) =>
    sortBy === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  return (
    <div className="overflow-x-auto rounded-xl border border-[#2D333B]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2D333B] bg-[#161B22]">
            <th className="px-4 py-3 text-left text-gray-400 font-medium">
              {balanceType === 'ar' ? 'Customer' : 'Vendor'}
            </th>
            {AGING_BUCKET_LABELS.map(b => (
              <th
                key={b.key}
                onClick={() => handleSort(b.key)}
                className="px-4 py-3 text-right text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
              >
                {b.label}{sortIndicator(b.key)}
              </th>
            ))}
            <th
              onClick={() => handleSort('total_balance')}
              className="px-4 py-3 text-right text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
            >
              Total{sortIndicator('total_balance')}
            </th>
            <th
              onClick={() => handleSort('overdue_balance')}
              className="px-4 py-3 text-right text-gray-400 font-medium cursor-pointer hover:text-white transition-colors"
            >
              Overdue{sortIndicator('overdue_balance')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(row => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-[#2D333B] hover:bg-[#1C2128] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              <td className="px-4 py-3 text-white font-medium">{(row as any)[nameKey] ?? '—'}</td>
              {AGING_BUCKET_LABELS.map(b => (
                <td key={b.key} className={`px-4 py-3 text-right tabular-nums ${b.isOverdue && row[b.key] > 0 ? 'text-red-400' : 'text-gray-300'}`}>
                  {formatCurrency(row[b.key])}
                </td>
              ))}
              <td className="px-4 py-3 text-right tabular-nums text-white font-medium">
                {formatCurrency(row.total_balance)}
              </td>
              <td className={`px-4 py-3 text-right tabular-nums font-medium ${row.overdue_balance > 0 ? 'text-red-400' : 'text-gray-300'}`}>
                {formatCurrency(row.overdue_balance)}
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No aging data available</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
