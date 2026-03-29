import type { RevenueBreakdownRow } from '@/types/breakdowns';

export const mockRevenueBreakdownByCustomer: RevenueBreakdownRow[] = [
  {
    customerId: 'cust-1',
    customerName: 'Acme Corp',
    revenueAmount: 45000,
    invoiceCount: 9,
    avgInvoiceValue: 5000,
    paymentCollectedAmount: 45000,
  },
  {
    customerId: 'cust-2',
    customerName: 'Beta Inc',
    revenueAmount: 30000,
    invoiceCount: 6,
    avgInvoiceValue: 5000,
    paymentCollectedAmount: 28000,
  },
  {
    customerId: 'cust-3',
    customerName: 'Gamma LLC',
    revenueAmount: 12000,
    invoiceCount: 4,
    avgInvoiceValue: 3000,
    paymentCollectedAmount: 12000,
  },
];

export const mockRevenueBreakdownByProduct: RevenueBreakdownRow[] = [
  {
    productId: 'prod-1',
    productName: 'Widget Pro',
    revenueAmount: 50000,
    invoiceCount: 10,
    avgInvoiceValue: 5000,
    paymentCollectedAmount: 50000,
  },
  {
    productId: 'prod-2',
    productName: 'Widget Lite',
    revenueAmount: 20000,
    invoiceCount: 8,
    avgInvoiceValue: 2500,
    paymentCollectedAmount: 18000,
  },
];

export const mockRevenueBreakdownByCategory: RevenueBreakdownRow[] = [
  {
    categoryId: 'cat-1',
    categoryName: 'Software',
    revenueAmount: 60000,
    invoiceCount: 12,
    avgInvoiceValue: 5000,
    paymentCollectedAmount: 60000,
  },
  {
    categoryId: 'cat-2',
    categoryName: 'Hardware',
    revenueAmount: 27000,
    invoiceCount: 9,
    avgInvoiceValue: 3000,
    paymentCollectedAmount: 25000,
  },
];

export const mockOtherOrgBreakdownRows = [
  {
    id: 'rb-org2',
    organization_id: 'org-2',
    customer_id: 'cust-99',
    product_id: null,
    category_id: null,
    period_id: 'p1',
    revenue_amount: 99999,
    invoice_count: 1,
    payment_collected_amount: 99999,
  },
];

// Raw DB rows as returned by ZeroDBClient.query
export const mockRawBreakdownRowsByCustomer = [
  {
    id: 'rb-1',
    organization_id: 'org-1',
    customer_id: 'cust-1',
    product_id: null,
    category_id: null,
    period_id: 'p1',
    revenue_amount: 45000,
    invoice_count: 9,
    payment_collected_amount: 45000,
  },
  {
    id: 'rb-2',
    organization_id: 'org-1',
    customer_id: 'cust-2',
    product_id: null,
    category_id: null,
    period_id: 'p1',
    revenue_amount: 30000,
    invoice_count: 6,
    payment_collected_amount: 28000,
  },
  {
    id: 'rb-3',
    organization_id: 'org-1',
    customer_id: 'cust-3',
    product_id: null,
    category_id: null,
    period_id: 'p1',
    revenue_amount: 12000,
    invoice_count: 4,
    payment_collected_amount: 12000,
  },
];

export const mockRawCustomerRows = [
  { id: 'cust-1', organization_id: 'org-1', name: 'Acme Corp' },
  { id: 'cust-2', organization_id: 'org-1', name: 'Beta Inc' },
  { id: 'cust-3', organization_id: 'org-1', name: 'Gamma LLC' },
];

export const mockRawProductRows = [
  { id: 'prod-1', organization_id: 'org-1', name: 'Widget Pro' },
  { id: 'prod-2', organization_id: 'org-1', name: 'Widget Lite' },
];

export const mockRawCategoryRows = [
  { id: 'cat-1', organization_id: 'org-1', name: 'Software' },
  { id: 'cat-2', organization_id: 'org-1', name: 'Hardware' },
];

export const mockRawBreakdownRowsByProduct = [
  {
    id: 'rb-p1',
    organization_id: 'org-1',
    customer_id: null,
    product_id: 'prod-1',
    category_id: null,
    period_id: 'p1',
    revenue_amount: 50000,
    invoice_count: 10,
    payment_collected_amount: 50000,
  },
  {
    id: 'rb-p2',
    organization_id: 'org-1',
    customer_id: null,
    product_id: 'prod-2',
    category_id: null,
    period_id: 'p1',
    revenue_amount: 20000,
    invoice_count: 8,
    payment_collected_amount: 18000,
  },
];

export const mockRawBreakdownRowsByCategory = [
  {
    id: 'rb-c1',
    organization_id: 'org-1',
    customer_id: null,
    product_id: null,
    category_id: 'cat-1',
    period_id: 'p1',
    revenue_amount: 60000,
    invoice_count: 12,
    payment_collected_amount: 60000,
  },
  {
    id: 'rb-c2',
    organization_id: 'org-1',
    customer_id: null,
    product_id: null,
    category_id: 'cat-2',
    period_id: 'p1',
    revenue_amount: 27000,
    invoice_count: 9,
    payment_collected_amount: 25000,
  },
];
