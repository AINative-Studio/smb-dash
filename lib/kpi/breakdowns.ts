import type { ZeroDBClient } from '@/lib/zerodb/client';
import type { BreakdownApiRequest, RevenueBreakdownRow } from '@/types/breakdowns';

interface RawBreakdownRow {
  id: string;
  organization_id: string;
  customer_id: string | null;
  product_id: string | null;
  category_id: string | null;
  period_id: string;
  revenue_amount: number;
  invoice_count: number;
  payment_collected_amount: number;
}

interface DimensionRow {
  id: string;
  organization_id: string;
  name: string;
}

export async function fetchRevenueBreakdown(
  client: ZeroDBClient,
  request: BreakdownApiRequest
): Promise<RevenueBreakdownRow[]> {
  const { organizationId, groupBy, sortOrder, limit } = request;

  const [breakdownResult, customerResult, productResult, categoryResult] = await Promise.all([
    client.query<RawBreakdownRow>('fact_revenue_breakdown', {
      organization_id: organizationId,
    }),
    client.query<DimensionRow>('dimension_customers', {
      organization_id: organizationId,
    }),
    client.query<DimensionRow>('dimension_products', {
      organization_id: organizationId,
    }),
    client.query<DimensionRow>('dimension_categories', {
      organization_id: organizationId,
    }),
  ]);

  const customerMap = new Map<string, string>();
  for (const row of customerResult.rows) {
    customerMap.set(row.id, row.name);
  }

  const productMap = new Map<string, string>();
  for (const row of productResult.rows) {
    productMap.set(row.id, row.name);
  }

  const categoryMap = new Map<string, string>();
  for (const row of categoryResult.rows) {
    categoryMap.set(row.id, row.name);
  }

  const rows: RevenueBreakdownRow[] = breakdownResult.rows.map((raw) => {
    const invoiceCount = raw.invoice_count;
    const avgInvoiceValue = invoiceCount > 0 ? raw.revenue_amount / invoiceCount : null;

    const result: RevenueBreakdownRow = {
      revenueAmount: raw.revenue_amount,
      invoiceCount,
      avgInvoiceValue,
      paymentCollectedAmount: raw.payment_collected_amount,
    };

    if (groupBy === 'customer' && raw.customer_id) {
      result.customerId = raw.customer_id;
      result.customerName = customerMap.get(raw.customer_id) ?? raw.customer_id;
    }

    if (groupBy === 'product' && raw.product_id) {
      result.productId = raw.product_id;
      result.productName = productMap.get(raw.product_id) ?? raw.product_id;
    }

    if (groupBy === 'category' && raw.category_id) {
      result.categoryId = raw.category_id;
      result.categoryName = categoryMap.get(raw.category_id) ?? raw.category_id;
    }

    return result;
  });

  // Sort by revenueAmount
  const order = sortOrder === 'asc' ? 1 : -1;
  rows.sort((a, b) => order * (a.revenueAmount - b.revenueAmount));

  if (limit !== undefined) {
    return rows.slice(0, limit);
  }

  return rows;
}
