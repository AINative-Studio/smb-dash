'use client';

import React, { useState } from 'react';
import type { RevenueBreakdownRow, ExpenseBreakdownRow, BreakdownGroupBy } from '@/types/breakdowns';

type AnyBreakdownRow = RevenueBreakdownRow | ExpenseBreakdownRow;

interface BreakdownTableProps {
  rows: AnyBreakdownRow[];
  groupBy: BreakdownGroupBy;
  onRowClick?: (row: AnyBreakdownRow) => void;
}

type SortDirection = 'asc' | 'desc' | null;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getRowLabel(row: AnyBreakdownRow, groupBy: BreakdownGroupBy): string {
  const r = row as RevenueBreakdownRow & ExpenseBreakdownRow;
  switch (groupBy) {
    case 'customer':
      return r.customerName ?? r.customerId ?? '—';
    case 'vendor':
      return r.vendorName ?? r.vendorId ?? '—';
    case 'product':
      return r.productName ?? r.productId ?? '—';
    case 'category':
      return r.categoryName ?? r.categoryId ?? '—';
    case 'account':
      return r.accountName ?? r.accountId ?? '—';
    default:
      return '—';
  }
}

function getPrimaryAmount(row: AnyBreakdownRow): number {
  const r = row as RevenueBreakdownRow & ExpenseBreakdownRow;
  return r.revenueAmount ?? r.expenseAmount ?? 0;
}

function getCount(row: AnyBreakdownRow): number {
  const r = row as RevenueBreakdownRow & ExpenseBreakdownRow;
  return r.invoiceCount ?? r.transactionCount ?? 0;
}

function getAvgAmount(row: AnyBreakdownRow): number | null {
  const r = row as RevenueBreakdownRow & ExpenseBreakdownRow;
  return r.avgInvoiceValue ?? r.avgTransactionAmount ?? null;
}

function getPrimaryAmountLabel(groupBy: BreakdownGroupBy): string {
  return groupBy === 'vendor' || groupBy === 'category' || groupBy === 'account'
    ? 'Expense Amount'
    : 'Revenue';
}

function getCountLabel(groupBy: BreakdownGroupBy): string {
  return groupBy === 'vendor' || groupBy === 'category' || groupBy === 'account'
    ? 'Transactions'
    : 'Invoices';
}

export function BreakdownTable({ rows, groupBy, onRowClick }: BreakdownTableProps) {
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  if (rows.length === 0) {
    return (
      <div data-testid="breakdown-table-empty">
        <p>No data available.</p>
      </div>
    );
  }

  const sortedRows = [...rows].sort((a, b) => {
    if (sortDir === null) return 0;
    const diff = getPrimaryAmount(a) - getPrimaryAmount(b);
    return sortDir === 'asc' ? diff : -diff;
  });

  function handleRevenueHeaderClick() {
    setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }

  return (
    <table data-testid="breakdown-table">
      <thead>
        <tr>
          <th>Name</th>
          <th
            data-testid="col-header-revenue"
            onClick={handleRevenueHeaderClick}
            style={{ cursor: 'pointer' }}
          >
            {getPrimaryAmountLabel(groupBy)}
          </th>
          <th>{getCountLabel(groupBy)}</th>
          <th>Avg Amount</th>
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row, index) => {
          const avg = getAvgAmount(row);
          return (
            <tr
              key={index}
              data-testid="breakdown-table-row"
              onClick={() => onRowClick?.(row)}
              style={{ cursor: onRowClick ? 'pointer' : undefined }}
            >
              <td>{getRowLabel(row, groupBy)}</td>
              <td>{formatCurrency(getPrimaryAmount(row))}</td>
              <td>{getCount(row)}</td>
              <td>
                {avg !== null ? (
                  formatCurrency(avg)
                ) : (
                  <span data-testid="avg-invoice-null">—</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
