import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import {
  mockRevenueBreakdownByCustomer,
  mockRevenueBreakdownByProduct,
} from '@/__tests__/fixtures/breakdowns';

vi.mock('@/lib/kpi/breakdowns', () => ({
  fetchRevenueBreakdown: vi.fn(),
}));

import { fetchRevenueBreakdown } from '@/lib/kpi/breakdowns';

const mockedFetch = vi.mocked(fetchRevenueBreakdown);

function buildRequest(params: Record<string, string>): NextRequest {
  const url = new URL('http://localhost/api/kpis/breakdowns/revenue');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new NextRequest(url.toString());
}

describe('GET /api/kpis/breakdowns/revenue', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('given valid organizationId and groupBy=customer', () => {
    it('returns 200 with a BreakdownApiResponse shape', async () => {
      mockedFetch.mockResolvedValue(mockRevenueBreakdownByCustomer);

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        groupBy: 'customer',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toHaveProperty('rows');
      expect(body).toHaveProperty('groupBy');
      expect(body).toHaveProperty('organizationId');
      expect(body).toHaveProperty('periodType');
      expect(body.organizationId).toBe('org-1');
      expect(body.groupBy).toBe('customer');
      expect(body.rows).toHaveLength(3);
    });
  });

  describe('given valid organizationId and groupBy=product', () => {
    it('returns 200 with product breakdown rows', async () => {
      mockedFetch.mockResolvedValue(mockRevenueBreakdownByProduct);

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        groupBy: 'product',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.groupBy).toBe('product');
      expect(body.rows).toHaveLength(2);
    });
  });

  describe('given organizationId query param is absent', () => {
    it('returns 400 with a validation error message', async () => {
      const { GET } = await import('./route');
      const request = buildRequest({ groupBy: 'customer' });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toHaveProperty('error');
    });
  });

  describe('given groupBy query param is absent', () => {
    it('returns 400 with a validation error message', async () => {
      const { GET } = await import('./route');
      const request = buildRequest({ organizationId: 'org-1' });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toHaveProperty('error');
    });
  });

  describe('given an invalid groupBy value', () => {
    it('returns 400 with a validation error message', async () => {
      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        groupBy: 'invalid_value',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toHaveProperty('error');
    });
  });

  describe('given fetchRevenueBreakdown returns an empty array', () => {
    it('returns 200 with an empty rows array', async () => {
      mockedFetch.mockResolvedValue([]);

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        groupBy: 'customer',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.rows).toEqual([]);
    });
  });

  describe('given fetchRevenueBreakdown throws an unexpected error', () => {
    it('returns 500 without leaking internal error details', async () => {
      mockedFetch.mockRejectedValue(new Error('DB connection refused: secret-host:5432'));

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        groupBy: 'customer',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toHaveProperty('error');
      expect(body.error).not.toContain('secret-host');
      expect(body.error).not.toContain('DB connection');
    });
  });

  describe('given optional limit param is provided', () => {
    it('passes limit to fetchRevenueBreakdown', async () => {
      mockedFetch.mockResolvedValue(mockRevenueBreakdownByCustomer.slice(0, 2));

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        groupBy: 'customer',
        limit: '2',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockedFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ limit: 2 })
      );
    });
  });

  describe('given optional periodType param is provided', () => {
    it('passes periodType to fetchRevenueBreakdown and echoes it in response', async () => {
      mockedFetch.mockResolvedValue(mockRevenueBreakdownByCustomer);

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        groupBy: 'customer',
        periodType: 'quarterly',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.periodType).toBe('quarterly');
      expect(mockedFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ periodType: 'quarterly' })
      );
    });
  });
});
