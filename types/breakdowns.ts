export interface RevenueBreakdownRow {
  customerId?: string;
  customerName?: string;
  productId?: string;
  productName?: string;
  categoryId?: string;
  categoryName?: string;
  revenueAmount: number;
  invoiceCount: number;
  avgInvoiceValue: number | null;
  paymentCollectedAmount: number;
}

export interface ExpenseBreakdownRow {
  vendorId?: string;
  vendorName?: string;
  categoryId?: string;
  categoryName?: string;
  accountId?: string;
  accountName?: string;
  expenseAmount: number;
  transactionCount: number;
  avgTransactionAmount: number | null;
}

export interface ArApBreakdownRow {
  balanceType: 'ar' | 'ap';
  customerId?: string;
  customerName?: string;
  vendorId?: string;
  vendorName?: string;
  currentBucket: number;
  bucket1_30: number;
  bucket31_60: number;
  bucket61_90: number;
  bucket90Plus: number;
  totalBalance: number;
  overdueBalance: number;
}

export type BreakdownGroupBy = 'customer' | 'vendor' | 'category' | 'product' | 'account';

export interface BreakdownApiRequest {
  organizationId: string;
  periodId?: string;
  periodType?: string;
  groupBy: BreakdownGroupBy;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface BreakdownApiResponse<T> {
  rows: T[];
  groupBy: string;
  organizationId: string;
  periodType: string;
}
