import React from 'react';
import type { ExpenseBreakdownRow } from '@/types/breakdowns';

interface ExpenseBreakdownTableProps {
  rows: ExpenseBreakdownRow[];
  groupBy: 'category' | 'vendor';
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ExpenseBreakdownTable({ rows, groupBy }: ExpenseBreakdownTableProps) {
  const nameKey = groupBy === 'vendor' ? 'vendorName' : 'categoryName';
  const nameLabel = groupBy === 'vendor' ? 'Vendor' : 'Category';

  return (
    <table data-testid="expense-breakdown-table">
      <thead>
        <tr>
          <th scope="col">{nameLabel}</th>
          <th scope="col">Expense Amount</th>
          <th scope="col">Transactions</th>
          <th scope="col">Avg Transaction</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const name = (row as Record<string, unknown>)[nameKey] as string | undefined;
          const id =
            groupBy === 'vendor'
              ? row.vendorId ?? String(index)
              : row.categoryId ?? String(index);

          return (
            <tr key={id} data-testid="expense-breakdown-row">
              <td>{name ?? id}</td>
              <td>{formatCurrency(row.expenseAmount)}</td>
              <td>{row.transactionCount}</td>
              <td>
                {row.avgTransactionAmount !== null && row.avgTransactionAmount !== undefined
                  ? formatCurrency(row.avgTransactionAmount)
                  : '—'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
