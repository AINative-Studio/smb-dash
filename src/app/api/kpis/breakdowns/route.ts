import { NextRequest, NextResponse } from 'next/server';
import type { RevenueBreakdownRow, ExpenseBreakdownRow } from '@/lib/types/breakdown';
import type { AgingBreakdownRow } from '@/lib/types/aging';

const MOCK_REVENUE: RevenueBreakdownRow[] = [
  { id: 'rb-1', organization_id: '', period_id: 'p1', customer_id: 'cust-1', customer_name: 'Acme Industries', product_id: null, product_name: null, category_id: 'cat-1', category_name: 'Software Services', revenue_amount: 145000, invoice_count: 12, avg_invoice_value: 12083, payment_collected_amount: 130000 },
  { id: 'rb-2', organization_id: '', period_id: 'p1', customer_id: 'cust-2', customer_name: 'GlobalTech', product_id: null, product_name: null, category_id: 'cat-2', category_name: 'Consulting', revenue_amount: 98000, invoice_count: 8, avg_invoice_value: 12250, payment_collected_amount: 92000 },
  { id: 'rb-3', organization_id: '', period_id: 'p1', customer_id: 'cust-3', customer_name: 'SmartSolutions', product_id: null, product_name: null, category_id: 'cat-1', category_name: 'Software Services', revenue_amount: 87000, invoice_count: 6, avg_invoice_value: 14500, payment_collected_amount: 87000 },
  { id: 'rb-4', organization_id: '', period_id: 'p1', customer_id: 'cust-4', customer_name: 'DataDriven Co', product_id: null, product_name: null, category_id: 'cat-3', category_name: 'SaaS Subscriptions', revenue_amount: 65000, invoice_count: 4, avg_invoice_value: 16250, payment_collected_amount: 55000 },
  { id: 'rb-5', organization_id: '', period_id: 'p1', customer_id: 'cust-5', customer_name: 'StartupXYZ', product_id: null, product_name: null, category_id: 'cat-2', category_name: 'Consulting', revenue_amount: 30000, invoice_count: 3, avg_invoice_value: 10000, payment_collected_amount: 25000 },
];

const MOCK_EXPENSES: ExpenseBreakdownRow[] = [
  { id: 'eb-1', organization_id: '', period_id: 'p1', vendor_id: 'vend-1', vendor_name: 'CloudHost Pro', category_id: 'cat-e1', category_name: 'Infrastructure', account_id: null, account_name: null, expense_amount: 45000, transaction_count: 3, avg_transaction_amount: 15000 },
  { id: 'eb-2', organization_id: '', period_id: 'p1', vendor_id: 'vend-4', vendor_name: 'Marketing Agency X', category_id: 'cat-e2', category_name: 'Marketing', account_id: null, account_name: null, expense_amount: 38000, transaction_count: 5, avg_transaction_amount: 7600 },
  { id: 'eb-3', organization_id: '', period_id: 'p1', vendor_id: 'vend-3', vendor_name: 'Legal Partners LLP', category_id: 'cat-e3', category_name: 'Legal', account_id: null, account_name: null, expense_amount: 22000, transaction_count: 2, avg_transaction_amount: 11000 },
  { id: 'eb-4', organization_id: '', period_id: 'p1', vendor_id: 'vend-2', vendor_name: 'Office Supply Co', category_id: 'cat-e4', category_name: 'Office & Admin', account_id: null, account_name: null, expense_amount: 12000, transaction_count: 8, avg_transaction_amount: 1500 },
  { id: 'eb-5', organization_id: '', period_id: 'p1', vendor_id: 'vend-5', vendor_name: 'TalentRecruit Inc', category_id: 'cat-e5', category_name: 'Payroll & HR', account_id: null, account_name: null, expense_amount: 185000, transaction_count: 1, avg_transaction_amount: 185000 },
];

const MOCK_AGING: AgingBreakdownRow[] = [
  { id: 'ag-1', organization_id: '', period_id: 'p1', balance_type: 'ar', customer_id: 'cust-1', customer_name: 'Acme Industries', vendor_id: null, vendor_name: null, current_bucket: 12000, bucket_1_30: 8000, bucket_31_60: 5000, bucket_61_90: 2000, bucket_90_plus: 0, total_balance: 27000, overdue_balance: 15000 },
  { id: 'ag-2', organization_id: '', period_id: 'p1', balance_type: 'ar', customer_id: 'cust-2', customer_name: 'GlobalTech', vendor_id: null, vendor_name: null, current_bucket: 15000, bucket_1_30: 6000, bucket_31_60: 3000, bucket_61_90: 0, bucket_90_plus: 4500, total_balance: 28500, overdue_balance: 13500 },
  { id: 'ag-3', organization_id: '', period_id: 'p1', balance_type: 'ar', customer_id: 'cust-3', customer_name: 'SmartSolutions', vendor_id: null, vendor_name: null, current_bucket: 8000, bucket_1_30: 5000, bucket_31_60: 2000, bucket_61_90: 3000, bucket_90_plus: 5000, total_balance: 23000, overdue_balance: 15000 },
  { id: 'ag-4', organization_id: '', period_id: 'p1', balance_type: 'ap', customer_id: null, customer_name: null, vendor_id: 'vend-1', vendor_name: 'CloudHost Pro', current_bucket: 8000, bucket_1_30: 4000, bucket_31_60: 2000, bucket_61_90: 0, bucket_90_plus: 0, total_balance: 14000, overdue_balance: 6000 },
  { id: 'ag-5', organization_id: '', period_id: 'p1', balance_type: 'ap', customer_id: null, customer_name: null, vendor_id: 'vend-3', vendor_name: 'Legal Partners LLP', current_bucket: 11000, bucket_1_30: 5200, bucket_31_60: 0, bucket_61_90: 4000, bucket_90_plus: 0, total_balance: 20200, overdue_balance: 9200 },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organization_id');
  if (!orgId) return NextResponse.json({ error: 'organization_id is required' }, { status: 400 });

  const type = searchParams.get('type') ?? 'revenue';
  const groupBy = searchParams.get('group_by');
  const sortBy = searchParams.get('sort_by');
  const sortDir = searchParams.get('sort_dir') ?? 'desc';
  const balanceType = searchParams.get('balance_type');

  const setOrgId = <T extends { organization_id: string }>(rows: T[]): T[] =>
    rows.map(r => ({ ...r, organization_id: orgId }));

  let data: unknown[];
  switch (type) {
    case 'revenue':
      data = setOrgId(MOCK_REVENUE);
      break;
    case 'expense':
      data = setOrgId(MOCK_EXPENSES);
      break;
    case 'aging':
      data = setOrgId(MOCK_AGING.filter(a => !balanceType || a.balance_type === balanceType));
      break;
    default:
      return NextResponse.json({ error: `Unknown breakdown type: ${type}` }, { status: 400 });
  }

  if (sortBy) {
    data.sort((a: any, b: any) => {
      const va = a[sortBy] ?? 0;
      const vb = b[sortBy] ?? 0;
      return sortDir === 'asc' ? va - vb : vb - va;
    });
  }

  return NextResponse.json({ data, type, organization_id: orgId });
}
