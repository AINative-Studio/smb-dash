import type { ExpenseBreakdownRow } from '@/types/breakdowns';
import type { TrendSeries } from '@/types/trends';

// ---------------------------------------------------------------------------
// Category breakdown fixtures
// ---------------------------------------------------------------------------

export const mockExpenseCategoryRows: ExpenseBreakdownRow[] = [
  {
    categoryId: 'cat-1',
    categoryName: 'Software & Subscriptions',
    expenseAmount: 12500,
    transactionCount: 8,
    avgTransactionAmount: 1562.5,
  },
  {
    categoryId: 'cat-2',
    categoryName: 'Payroll',
    expenseAmount: 85000,
    transactionCount: 2,
    avgTransactionAmount: 42500,
  },
  {
    categoryId: 'cat-3',
    categoryName: 'Office Supplies',
    expenseAmount: 3200,
    transactionCount: 12,
    avgTransactionAmount: 266.67,
  },
];

export const mockEmptyCategoryRows: ExpenseBreakdownRow[] = [];

// ---------------------------------------------------------------------------
// Vendor breakdown fixtures
// ---------------------------------------------------------------------------

export const mockExpenseVendorRows: ExpenseBreakdownRow[] = [
  {
    vendorId: 'v-1',
    vendorName: 'Acme Corp',
    expenseAmount: 22000,
    transactionCount: 5,
    avgTransactionAmount: 4400,
  },
  {
    vendorId: 'v-2',
    vendorName: 'Office Depot',
    expenseAmount: 3200,
    transactionCount: 12,
    avgTransactionAmount: 266.67,
  },
  {
    vendorId: 'v-3',
    vendorName: 'Gusto Payroll',
    expenseAmount: 85000,
    transactionCount: 2,
    avgTransactionAmount: 42500,
  },
];

export const mockEmptyVendorRows: ExpenseBreakdownRow[] = [];

// ---------------------------------------------------------------------------
// Raw DB rows for unit tests
// ---------------------------------------------------------------------------

export const mockExpenseFactRows = [
  {
    id: 'ef-1',
    organization_id: 'org-1',
    period_id: 'p1',
    category_id: 'cat-1',
    vendor_id: 'v-1',
    expense_amount: 12500,
    transaction_count: 8,
  },
  {
    id: 'ef-2',
    organization_id: 'org-1',
    period_id: 'p1',
    category_id: 'cat-2',
    vendor_id: 'v-3',
    expense_amount: 85000,
    transaction_count: 2,
  },
  {
    id: 'ef-3',
    organization_id: 'org-1',
    period_id: 'p1',
    category_id: 'cat-3',
    vendor_id: 'v-2',
    expense_amount: 3200,
    transaction_count: 12,
  },
];

export const mockOtherOrgExpenseFactRows = [
  {
    id: 'ef-99',
    organization_id: 'org-2',
    period_id: 'p1',
    category_id: 'cat-1',
    vendor_id: 'v-9',
    expense_amount: 99999,
    transaction_count: 1,
  },
];

export const mockCategoryDimensionRows = [
  { id: 'cat-1', name: 'Software & Subscriptions', organization_id: 'org-1' },
  { id: 'cat-2', name: 'Payroll', organization_id: 'org-1' },
  { id: 'cat-3', name: 'Office Supplies', organization_id: 'org-1' },
];

export const mockVendorDimensionRows = [
  { id: 'v-1', name: 'Acme Corp', organization_id: 'org-1' },
  { id: 'v-2', name: 'Office Depot', organization_id: 'org-1' },
  { id: 'v-3', name: 'Gusto Payroll', organization_id: 'org-1' },
];

// ---------------------------------------------------------------------------
// Expense trend fixture (reuses TrendSeries shape)
// ---------------------------------------------------------------------------

export const mockExpenseTrendSeries: TrendSeries = {
  metricName: 'total_expenses',
  displayName: 'Total Expenses',
  unit: 'currency',
  dataPoints: [
    { periodId: 'p1', label: 'Jan 2026', value: 100700, unit: 'currency' },
    { periodId: 'p2', label: 'Feb 2026', value: 98500, unit: 'currency' },
    { periodId: 'p3', label: 'Mar 2026', value: 105200, unit: 'currency' },
  ],
};

export const mockEmptyExpenseTrendSeries: TrendSeries = {
  metricName: 'total_expenses',
  displayName: 'Total Expenses',
  unit: 'currency',
  dataPoints: [],
};
