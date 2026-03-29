export interface RevenueBreakdownRow {
  id: string;
  organization_id: string;
  period_id: string;
  customer_id: string | null;
  customer_name: string | null;
  product_id: string | null;
  product_name: string | null;
  category_id: string | null;
  category_name: string | null;
  revenue_amount: number;
  invoice_count: number;
  avg_invoice_value: number | null;
  payment_collected_amount: number;
}

export interface ExpenseBreakdownRow {
  id: string;
  organization_id: string;
  period_id: string;
  vendor_id: string | null;
  vendor_name: string | null;
  category_id: string | null;
  category_name: string | null;
  account_id: string | null;
  account_name: string | null;
  expense_amount: number;
  transaction_count: number;
  avg_transaction_amount: number | null;
}

export type SortDirection = 'asc' | 'desc';
export type BreakdownGroupBy = 'customer' | 'product' | 'category' | 'vendor' | 'account';
