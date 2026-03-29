import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import {
  mockExpenseCategoryRows,
  mockExpenseVendorRows,
  mockEmptyCategoryRows,
} from '@/__tests__/fixtures/expenses';

vi.mock('@/lib/kpi/expense-breakdowns', () => ({
  fetchExpenseBreakdown: vi.fn(),
}));

import { fetchExpenseBreakdown } from '@/lib/kpi/expense-breakdowns';

const mockedFetchExpenseBreakdown = vi.mocked(fetchExpenseBreakdown);

function buildRequest(params: Record<string, string>): NextRequest {
  const url = new URL('http://localhost/api/kpis/breakdowns/expenses');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new NextRequest(url.toString());
}

describe('GET /api/kpis/breakdowns/expenses', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('given valid organizationId and groupBy=category', () => {
    it('returns 200 with a BreakdownApiResponse containing category rows', async () => {
      mockedFetchExpenseBreakdown.mockResolvedValue(mockExpenseCategoryRows);

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        groupBy: 'category',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toHaveProperty('rows');
      expect(body).toHaveProperty('groupBy', 'category');
      expect(body).toHaveProperty('organizationId', 'org-1');
      expect(body.rows).toHaveLength(3);
    });
  });

  describe('given valid organizationId and groupBy=vendor', () => {
    it('returns 200 with a BreakdownApiResponse containing vendor rows', async () => {
      mockedFetchExpenseBreakdown.mockResolvedValue(mockExpenseVendorRows);

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        groupBy: 'vendor',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.groupBy).toBe('vendor');
      expect(body.rows).toHaveLength(3);
    });
  });

  describe('given organizationId query param is absent', () => {
    it('returns 400 with a validation error', async () => {
      const { GET } = await import('./route');
      const request = buildRequest({ groupBy: 'category' });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toHaveProperty('error');
    });
  });

  describe('given groupBy query param is absent', () => {
    it('returns 400 with a validation error', async () => {
      const { GET } = await import('./route');
      const request = buildRequest({ organizationId: 'org-1' });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toHaveProperty('error');
    });
  });

  describe('given an invalid groupBy value', () => {
    it('returns 400 with a validation error', async () => {
      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        groupBy: 'invalid_dimension',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toHaveProperty('error');
    });
  });

  describe('given fetchExpenseBreakdown returns an empty array', () => {
    it('returns 200 with an empty rows array', async () => {
      mockedFetchExpenseBreakdown.mockResolvedValue(mockEmptyCategoryRows);

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        groupBy: 'category',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.rows).toEqual([]);
    });
  });

  describe('given fetchExpenseBreakdown throws an unexpected error', () => {
    it('returns 500 without leaking internal error details', async () => {
      mockedFetchExpenseBreakdown.mockRejectedValue(
        new Error('DB connection refused: secret-host:5432')
      );

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        groupBy: 'category',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toHaveProperty('error');
      expect(body.error).not.toContain('secret-host');
      expect(body.error).not.toContain('DB connection');
    });
  });
});
