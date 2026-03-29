import type { ZeroDBClient } from '@/lib/zerodb/client';
import type { ExpenseBreakdownRow, BreakdownApiRequest } from '@/types/breakdowns';

interface ExpenseFactRow {
  id: string;
  organization_id: string;
  period_id: string;
  category_id: string;
  vendor_id: string;
  expense_amount: number;
  transaction_count: number;
}

interface CategoryDimensionRow {
  id: string;
  name: string;
  organization_id: string;
}

interface VendorDimensionRow {
  id: string;
  name: string;
  organization_id: string;
}

export async function fetchExpenseBreakdown(
  client: ZeroDBClient,
  request: BreakdownApiRequest
): Promise<ExpenseBreakdownRow[]> {
  const { organizationId, groupBy, sortBy, sortOrder } = request;

  const [factResult, categoryResult, vendorResult] = await Promise.all([
    client.query<ExpenseFactRow>('fact_expense_breakdown', {
      organization_id: organizationId,
    }),
    client.query<CategoryDimensionRow>('dimension_categories', {
      organization_id: organizationId,
    }),
    client.query<VendorDimensionRow>('dimension_vendors', {
      organization_id: organizationId,
    }),
  ]);

  const categoryMap = new Map<string, string>();
  for (const cat of categoryResult.rows) {
    categoryMap.set(cat.id, cat.name);
  }

  const vendorMap = new Map<string, string>();
  for (const vendor of vendorResult.rows) {
    vendorMap.set(vendor.id, vendor.name);
  }

  if (groupBy === 'category') {
    // Aggregate by category_id
    const grouped = new Map<string, { expenseAmount: number; transactionCount: number }>();

    for (const row of factResult.rows) {
      const key = row.category_id;
      const existing = grouped.get(key) ?? { expenseAmount: 0, transactionCount: 0 };
      existing.expenseAmount += row.expense_amount;
      existing.transactionCount += row.transaction_count;
      grouped.set(key, existing);
    }

    const rows: ExpenseBreakdownRow[] = Array.from(grouped.entries()).map(
      ([categoryId, agg]) => ({
        categoryId,
        categoryName: categoryMap.get(categoryId) ?? categoryId,
        expenseAmount: agg.expenseAmount,
        transactionCount: agg.transactionCount,
        avgTransactionAmount:
          agg.transactionCount > 0 ? agg.expenseAmount / agg.transactionCount : null,
      })
    );

    return applySorting(rows, sortBy, sortOrder);
  }

  if (groupBy === 'vendor') {
    // Aggregate by vendor_id
    const grouped = new Map<string, { expenseAmount: number; transactionCount: number }>();

    for (const row of factResult.rows) {
      const key = row.vendor_id;
      const existing = grouped.get(key) ?? { expenseAmount: 0, transactionCount: 0 };
      existing.expenseAmount += row.expense_amount;
      existing.transactionCount += row.transaction_count;
      grouped.set(key, existing);
    }

    const rows: ExpenseBreakdownRow[] = Array.from(grouped.entries()).map(
      ([vendorId, agg]) => ({
        vendorId,
        vendorName: vendorMap.get(vendorId) ?? vendorId,
        expenseAmount: agg.expenseAmount,
        transactionCount: agg.transactionCount,
        avgTransactionAmount:
          agg.transactionCount > 0 ? agg.expenseAmount / agg.transactionCount : null,
      })
    );

    return applySorting(rows, sortBy, sortOrder);
  }

  return [];
}

function applySorting(
  rows: ExpenseBreakdownRow[],
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
): ExpenseBreakdownRow[] {
  if (!sortBy) return rows;

  const direction = sortOrder === 'asc' ? 1 : -1;

  return [...rows].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[sortBy];
    const bVal = (b as Record<string, unknown>)[sortBy];

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * direction;
    }
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * direction;
    }
    return 0;
  });
}
