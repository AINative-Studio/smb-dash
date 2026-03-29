'use client';

import { useState, useMemo } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  accessor: (row: T) => string | number;
  format?: (value: any) => string;
  align?: 'left' | 'right';
  sortable?: boolean;
  highlight?: (value: any) => string;
}

interface SortableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  defaultSortKey?: string;
  defaultSortDir?: 'asc' | 'desc';
  emptyMessage?: string;
}

export function SortableTable<T>({
  data, columns, keyExtractor, onRowClick,
  defaultSortKey, defaultSortDir = 'desc', emptyMessage = 'No data available',
}: SortableTableProps<T>) {
  const [sortKey, setSortKey] = useState(defaultSortKey ?? columns[0]?.key ?? '');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultSortDir);

  const sorted = useMemo(() => {
    const col = columns.find(c => c.key === sortKey);
    if (!col) return data;
    return [...data].sort((a, b) => {
      const va = col.accessor(a);
      const vb = col.accessor(b);
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [data, columns, sortKey, sortDir]);

  function handleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#2D333B]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2D333B] bg-[#161B22]">
            {columns.map(col => (
              <th
                key={col.key}
                onClick={col.sortable !== false ? () => handleSort(col.key) : undefined}
                className={`px-4 py-3 font-medium text-gray-400 ${col.align === 'right' ? 'text-right' : 'text-left'} ${col.sortable !== false ? 'cursor-pointer hover:text-white transition-colors' : ''}`}
              >
                {col.label}
                {sortKey === col.key && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(row => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-[#2D333B] hover:bg-[#1C2128] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map(col => {
                const raw = col.accessor(row);
                const display = col.format ? col.format(raw) : String(raw);
                const color = col.highlight ? col.highlight(raw) : 'text-gray-300';
                return (
                  <td key={col.key} className={`px-4 py-3 tabular-nums ${col.align === 'right' ? 'text-right' : ''} ${color}`}>
                    {display}
                  </td>
                );
              })}
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">{emptyMessage}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
