import { describe, it, expect, vi } from 'vitest';
import { fetchRevenueBreakdown } from './breakdowns';
import type { ZeroDBClient } from '@/lib/zerodb/client';
import type { BreakdownApiRequest } from '@/types/breakdowns';
import {
  mockRawBreakdownRowsByCustomer,
  mockRawBreakdownRowsByProduct,
  mockRawBreakdownRowsByCategory,
  mockRawCustomerRows,
  mockRawProductRows,
  mockRawCategoryRows,
  mockOtherOrgBreakdownRows,
} from '@/__tests__/fixtures/breakdowns';

function createMockClient(overrides?: {
  breakdownRows?: typeof mockRawBreakdownRowsByCustomer;
  customerRows?: typeof mockRawCustomerRows;
  productRows?: typeof mockRawProductRows;
  categoryRows?: typeof mockRawCategoryRows;
}): ZeroDBClient {
  const breakdownRows = overrides?.breakdownRows ?? mockRawBreakdownRowsByCustomer;
  const customerRows = overrides?.customerRows ?? mockRawCustomerRows;
  const productRows = overrides?.productRows ?? mockRawProductRows;
  const categoryRows = overrides?.categoryRows ?? mockRawCategoryRows;

  return {
    query: vi.fn(async (table: string, filters: Record<string, unknown>) => {
      if (table === 'fact_revenue_breakdown') {
        const orgId = filters.organization_id;
        let rows = breakdownRows.filter((r) => r.organization_id === orgId);
        return { rows };
      }
      if (table === 'dimension_customers') {
        return { rows: customerRows.filter((r) => r.organization_id === filters.organization_id) };
      }
      if (table === 'dimension_products') {
        return { rows: productRows.filter((r) => r.organization_id === filters.organization_id) };
      }
      if (table === 'dimension_categories') {
        return { rows: categoryRows.filter((r) => r.organization_id === filters.organization_id) };
      }
      return { rows: [] };
    }),
  };
}

describe('fetchRevenueBreakdown', () => {
  describe('given breakdown data grouped by customer', () => {
    it('returns rows with customerName joined from dimension_customers', async () => {
      const client = createMockClient();
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'customer',
      };

      const rows = await fetchRevenueBreakdown(client, request);

      expect(rows).toHaveLength(3);
      expect(rows[0].customerId).toBe('cust-1');
      expect(rows[0].customerName).toBe('Acme Corp');
    });

    it('returns rows ordered by revenueAmount descending', async () => {
      const client = createMockClient();
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'customer',
      };

      const rows = await fetchRevenueBreakdown(client, request);

      expect(rows[0].revenueAmount).toBeGreaterThanOrEqual(rows[1].revenueAmount);
      expect(rows[1].revenueAmount).toBeGreaterThanOrEqual(rows[2].revenueAmount);
    });

    it('calculates avgInvoiceValue as revenueAmount divided by invoiceCount', async () => {
      const client = createMockClient();
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'customer',
      };

      const rows = await fetchRevenueBreakdown(client, request);

      // 45000 / 9 = 5000
      expect(rows[0].avgInvoiceValue).toBe(5000);
    });
  });

  describe('given breakdown data grouped by product', () => {
    it('returns rows with productName joined from dimension_products', async () => {
      const client = createMockClient({
        breakdownRows: mockRawBreakdownRowsByProduct,
      });
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'product',
      };

      const rows = await fetchRevenueBreakdown(client, request);

      expect(rows).toHaveLength(2);
      expect(rows[0].productId).toBe('prod-1');
      expect(rows[0].productName).toBe('Widget Pro');
    });
  });

  describe('given breakdown data grouped by category', () => {
    it('returns rows with categoryName joined from dimension_categories', async () => {
      const client = createMockClient({
        breakdownRows: mockRawBreakdownRowsByCategory,
      });
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'category',
      };

      const rows = await fetchRevenueBreakdown(client, request);

      expect(rows).toHaveLength(2);
      expect(rows[0].categoryId).toBe('cat-1');
      expect(rows[0].categoryName).toBe('Software');
    });
  });

  describe('given no breakdown data exists', () => {
    it('returns an empty array without throwing', async () => {
      const client = createMockClient({ breakdownRows: [] });
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'customer',
      };

      const rows = await fetchRevenueBreakdown(client, request);

      expect(rows).toEqual([]);
    });
  });

  describe('given a limit is specified', () => {
    it('returns at most limit rows', async () => {
      const client = createMockClient();
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'customer',
        limit: 2,
      };

      const rows = await fetchRevenueBreakdown(client, request);

      expect(rows).toHaveLength(2);
    });
  });

  describe('given data for multiple organizations', () => {
    it('only returns rows for the specified organizationId', async () => {
      const allRows = [
        ...mockRawBreakdownRowsByCustomer,
        ...mockOtherOrgBreakdownRows,
      ];
      const client = createMockClient({ breakdownRows: allRows as typeof mockRawBreakdownRowsByCustomer });
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'customer',
      };

      const rows = await fetchRevenueBreakdown(client, request);

      expect(rows).toHaveLength(3);
      rows.forEach((r) => {
        expect(r.revenueAmount).not.toBe(99999);
      });
    });
  });

  describe('given a row with zero invoiceCount', () => {
    it('returns null for avgInvoiceValue instead of dividing by zero', async () => {
      const zeroCountRows = [
        {
          id: 'rb-zero',
          organization_id: 'org-1',
          customer_id: 'cust-1',
          product_id: null,
          category_id: null,
          period_id: 'p1',
          revenue_amount: 5000,
          invoice_count: 0,
          payment_collected_amount: 0,
        },
      ];
      const client = createMockClient({ breakdownRows: zeroCountRows });
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'customer',
      };

      const rows = await fetchRevenueBreakdown(client, request);

      expect(rows[0].avgInvoiceValue).toBeNull();
    });
  });

  describe('given a sortOrder of asc is specified', () => {
    it('returns rows ordered by revenueAmount ascending', async () => {
      const client = createMockClient();
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'customer',
        sortOrder: 'asc',
      };

      const rows = await fetchRevenueBreakdown(client, request);

      expect(rows[0].revenueAmount).toBeLessThanOrEqual(rows[1].revenueAmount);
      expect(rows[1].revenueAmount).toBeLessThanOrEqual(rows[2].revenueAmount);
    });
  });
});
