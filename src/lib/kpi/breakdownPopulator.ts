import type { RevenueBreakdownRow, ExpenseBreakdownRow } from '@/lib/types/breakdown';
import type { AgingBreakdownRow } from '@/lib/types/aging';

interface PopulateBreakdownOptions {
  organizationId: string;
  periodId: string;
}

export function populateRevenueBreakdowns(options: PopulateBreakdownOptions): RevenueBreakdownRow[] {
  const { organizationId: orgId, periodId } = options;
  return [
    { id: `rb-${orgId}-1`, organization_id: orgId, period_id: periodId, customer_id: 'cust-1', customer_name: 'Acme Industries', product_id: 'prod-1', product_name: 'Enterprise Plan', category_id: 'cat-1', category_name: 'Software Services', revenue_amount: 145000, invoice_count: 12, avg_invoice_value: 12083, payment_collected_amount: 130000 },
    { id: `rb-${orgId}-2`, organization_id: orgId, period_id: periodId, customer_id: 'cust-2', customer_name: 'GlobalTech', product_id: 'prod-2', product_name: 'Pro Plan', category_id: 'cat-2', category_name: 'Consulting', revenue_amount: 98000, invoice_count: 8, avg_invoice_value: 12250, payment_collected_amount: 92000 },
    { id: `rb-${orgId}-3`, organization_id: orgId, period_id: periodId, customer_id: 'cust-3', customer_name: 'SmartSolutions', product_id: 'prod-1', product_name: 'Enterprise Plan', category_id: 'cat-1', category_name: 'Software Services', revenue_amount: 87000, invoice_count: 6, avg_invoice_value: 14500, payment_collected_amount: 87000 },
    { id: `rb-${orgId}-4`, organization_id: orgId, period_id: periodId, customer_id: 'cust-4', customer_name: 'DataDriven Co', product_id: 'prod-3', product_name: 'Starter Plan', category_id: 'cat-3', category_name: 'SaaS Subscriptions', revenue_amount: 65000, invoice_count: 4, avg_invoice_value: 16250, payment_collected_amount: 55000 },
    { id: `rb-${orgId}-5`, organization_id: orgId, period_id: periodId, customer_id: 'cust-5', customer_name: 'StartupXYZ', product_id: 'prod-4', product_name: 'Custom Integration', category_id: 'cat-2', category_name: 'Consulting', revenue_amount: 30000, invoice_count: 3, avg_invoice_value: 10000, payment_collected_amount: 25000 },
  ];
}

export function populateExpenseBreakdowns(options: PopulateBreakdownOptions): ExpenseBreakdownRow[] {
  const { organizationId: orgId, periodId } = options;
  return [
    { id: `eb-${orgId}-1`, organization_id: orgId, period_id: periodId, vendor_id: 'vend-5', vendor_name: 'TalentRecruit Inc', category_id: 'cat-e5', category_name: 'Payroll & HR', account_id: 'acc-1', account_name: 'Salaries', expense_amount: 185000, transaction_count: 1, avg_transaction_amount: 185000 },
    { id: `eb-${orgId}-2`, organization_id: orgId, period_id: periodId, vendor_id: 'vend-1', vendor_name: 'CloudHost Pro', category_id: 'cat-e1', category_name: 'Infrastructure', account_id: 'acc-2', account_name: 'Cloud Hosting', expense_amount: 45000, transaction_count: 3, avg_transaction_amount: 15000 },
    { id: `eb-${orgId}-3`, organization_id: orgId, period_id: periodId, vendor_id: 'vend-4', vendor_name: 'Marketing Agency X', category_id: 'cat-e2', category_name: 'Marketing', account_id: 'acc-3', account_name: 'Advertising', expense_amount: 38000, transaction_count: 5, avg_transaction_amount: 7600 },
    { id: `eb-${orgId}-4`, organization_id: orgId, period_id: periodId, vendor_id: 'vend-3', vendor_name: 'Legal Partners LLP', category_id: 'cat-e3', category_name: 'Legal', account_id: 'acc-4', account_name: 'Legal Fees', expense_amount: 22000, transaction_count: 2, avg_transaction_amount: 11000 },
    { id: `eb-${orgId}-5`, organization_id: orgId, period_id: periodId, vendor_id: 'vend-2', vendor_name: 'Office Supply Co', category_id: 'cat-e4', category_name: 'Office & Admin', account_id: 'acc-5', account_name: 'Office Supplies', expense_amount: 12000, transaction_count: 8, avg_transaction_amount: 1500 },
  ];
}

export function populateAgingBreakdowns(options: PopulateBreakdownOptions): AgingBreakdownRow[] {
  const { organizationId: orgId, periodId } = options;
  return [
    { id: `ag-${orgId}-ar-1`, organization_id: orgId, period_id: periodId, balance_type: 'ar', customer_id: 'cust-1', customer_name: 'Acme Industries', vendor_id: null, vendor_name: null, current_bucket: 12000, bucket_1_30: 8000, bucket_31_60: 5000, bucket_61_90: 2000, bucket_90_plus: 0, total_balance: 27000, overdue_balance: 15000 },
    { id: `ag-${orgId}-ar-2`, organization_id: orgId, period_id: periodId, balance_type: 'ar', customer_id: 'cust-2', customer_name: 'GlobalTech', vendor_id: null, vendor_name: null, current_bucket: 15000, bucket_1_30: 6000, bucket_31_60: 3000, bucket_61_90: 0, bucket_90_plus: 4500, total_balance: 28500, overdue_balance: 13500 },
    { id: `ag-${orgId}-ar-3`, organization_id: orgId, period_id: periodId, balance_type: 'ar', customer_id: 'cust-3', customer_name: 'SmartSolutions', vendor_id: null, vendor_name: null, current_bucket: 8000, bucket_1_30: 5000, bucket_31_60: 2000, bucket_61_90: 3000, bucket_90_plus: 5000, total_balance: 23000, overdue_balance: 15000 },
    { id: `ag-${orgId}-ap-1`, organization_id: orgId, period_id: periodId, balance_type: 'ap', customer_id: null, customer_name: null, vendor_id: 'vend-1', vendor_name: 'CloudHost Pro', current_bucket: 8000, bucket_1_30: 4000, bucket_31_60: 2000, bucket_61_90: 0, bucket_90_plus: 0, total_balance: 14000, overdue_balance: 6000 },
    { id: `ag-${orgId}-ap-2`, organization_id: orgId, period_id: periodId, balance_type: 'ap', customer_id: null, customer_name: null, vendor_id: 'vend-3', vendor_name: 'Legal Partners LLP', current_bucket: 11000, bucket_1_30: 5200, bucket_31_60: 0, bucket_61_90: 4000, bucket_90_plus: 0, total_balance: 20200, overdue_balance: 9200 },
  ];
}

export function validateBreakdownTotals(revenue: RevenueBreakdownRow[], expectedTotal: number): { valid: boolean; error: string | null } {
  const actualTotal = revenue.reduce((sum, r) => sum + r.revenue_amount, 0);
  if (Math.abs(actualTotal - expectedTotal) > 1) {
    return { valid: false, error: `Revenue breakdown total (${actualTotal}) != expected (${expectedTotal})` };
  }
  return { valid: true, error: null };
}
