import { describe, it, expect, vi } from 'vitest';
import { fetchExpenseBreakdown } from './expense-breakdowns';
import type { ZeroDBClient } from '@/lib/zerodb/client';
import type { BreakdownApiRequest } from '@/types/breakdowns';
import {
  mockExpenseFactRows,
  mockOtherOrgExpenseFactRows,
  mockCategoryDimensionRows,
  mockVendorDimensionRows,
} from '@/__tests__/fixtures/expenses';

function createMockClient(overrides?: {
  factRows?: typeof mockExpenseFactRows;
  categoryRows?: typeof mockCategoryDimensionRows;
  vendorRows?: typeof mockVendorDimensionRows;
}): ZeroDBClient {
  const factRows = overrides?.factRows ?? mockExpenseFactRows;
  const categoryRows = overrides?.categoryRows ?? mockCategoryDimensionRows;
  const vendorRows = overrides?.vendorRows ?? mockVendorDimensionRows;

  return {
    query: vi.fn(async (table: string, filters: Record<string, unknown>) => {
      if (table === 'fact_expense_breakdown') {
        const orgId = filters.organization_id;
        const rows = factRows.filter((r) => r.organization_id === orgId);
        return { rows };
      }
      if (table === 'dimension_categories') {
        const orgId = filters.organization_id;
        return { rows: categoryRows.filter((r) => r.organization_id === orgId) };
      }
      if (table === 'dimension_vendors') {
        const orgId = filters.organization_id;
        return { rows: vendorRows.filter((r) => r.organization_id === orgId) };
      }
      return { rows: [] };
    }),
  };
}

describe('fetchExpenseBreakdown', () => {
  describe('given groupBy=category with data present', () => {
    it('returns ExpenseBreakdownRows aggregated by category with names resolved', async () => {
      const client = createMockClient();
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'category',
        periodType: 'monthly',
      };

      const result = await fetchExpenseBreakdown(client, request);

      expect(result).toHaveLength(3);
      const software = result.find((r) => r.categoryName === 'Software & Subscriptions');
      expect(software).toBeDefined();
      expect(software!.expenseAmount).toBe(12500);
      expect(software!.transactionCount).toBe(8);
    });
  });

  describe('given groupBy=vendor with data present', () => {
    it('returns ExpenseBreakdownRows aggregated by vendor with names resolved', async () => {
      const client = createMockClient();
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'vendor',
        periodType: 'monthly',
      };

      const result = await fetchExpenseBreakdown(client, request);

      expect(result).toHaveLength(3);
      const gusto = result.find((r) => r.vendorName === 'Gusto Payroll');
      expect(gusto).toBeDefined();
      expect(gusto!.expenseAmount).toBe(85000);
      expect(gusto!.transactionCount).toBe(2);
    });
  });

  describe('given groupBy=category and no expense records exist', () => {
    it('returns an empty array', async () => {
      const client = createMockClient({ factRows: [] });
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'category',
        periodType: 'monthly',
      };

      const result = await fetchExpenseBreakdown(client, request);

      expect(result).toEqual([]);
    });
  });

  describe('given groupBy=vendor and no expense records exist', () => {
    it('returns an empty array', async () => {
      const client = createMockClient({ factRows: [] });
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'vendor',
        periodType: 'monthly',
      };

      const result = await fetchExpenseBreakdown(client, request);

      expect(result).toEqual([]);
    });
  });

  describe('given data exists for multiple organizations', () => {
    it('returns only rows for the specified organizationId', async () => {
      const allRows = [...mockExpenseFactRows, ...mockOtherOrgExpenseFactRows];
      const client = createMockClient({ factRows: allRows });
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'category',
        periodType: 'monthly',
      };

      const result = await fetchExpenseBreakdown(client, request);

      expect(result).toHaveLength(3);
      result.forEach((r) => {
        expect(r.expenseAmount).not.toBe(99999);
      });
    });
  });

  describe('given a vendor row whose name cannot be resolved in dimension_vendors', () => {
    it('falls back to the raw vendor id as the vendorName', async () => {
      const factRowsWithUnknownVendor = [
        {
          id: 'ef-new',
          organization_id: 'org-1',
          period_id: 'p1',
          category_id: 'cat-1',
          vendor_id: 'v-unknown',
          expense_amount: 500,
          transaction_count: 1,
        },
      ];
      const client = createMockClient({ factRows: factRowsWithUnknownVendor });
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'vendor',
        periodType: 'monthly',
      };

      const result = await fetchExpenseBreakdown(client, request);

      expect(result).toHaveLength(1);
      expect(result[0].vendorId).toBe('v-unknown');
      expect(result[0].vendorName).toBe('v-unknown');
    });
  });

  describe('given a category row whose name cannot be resolved in dimension_categories', () => {
    it('falls back to the raw category id as the categoryName', async () => {
      const factRowsWithUnknownCategory = [
        {
          id: 'ef-new',
          organization_id: 'org-1',
          period_id: 'p1',
          category_id: 'cat-unknown',
          vendor_id: 'v-1',
          expense_amount: 500,
          transaction_count: 1,
        },
      ];
      const client = createMockClient({ factRows: factRowsWithUnknownCategory });
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'category',
        periodType: 'monthly',
      };

      const result = await fetchExpenseBreakdown(client, request);

      expect(result).toHaveLength(1);
      expect(result[0].categoryId).toBe('cat-unknown');
      expect(result[0].categoryName).toBe('cat-unknown');
    });
  });

  describe('given sortBy=expenseAmount with sortOrder=desc', () => {
    it('returns rows sorted by expenseAmount descending', async () => {
      const client = createMockClient();
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'category',
        sortBy: 'expenseAmount',
        sortOrder: 'desc',
        periodType: 'monthly',
      };

      const result = await fetchExpenseBreakdown(client, request);

      expect(result[0].expenseAmount).toBeGreaterThanOrEqual(result[1].expenseAmount);
      expect(result[1].expenseAmount).toBeGreaterThanOrEqual(result[2].expenseAmount);
    });
  });

  describe('given avgTransactionAmount calculation', () => {
    it('computes avgTransactionAmount as expenseAmount divided by transactionCount', async () => {
      const client = createMockClient();
      const request: BreakdownApiRequest = {
        organizationId: 'org-1',
        groupBy: 'category',
        periodType: 'monthly',
      };

      const result = await fetchExpenseBreakdown(client, request);

      const software = result.find((r) => r.categoryName === 'Software & Subscriptions');
      expect(software!.avgTransactionAmount).toBeCloseTo(1562.5, 1);
    });
  });
});
