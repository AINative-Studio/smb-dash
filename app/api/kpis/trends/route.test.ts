import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { mockRevenueSeries, mockProfitSeries, mockEmptySeries } from '@/__tests__/fixtures/trends';

vi.mock('@/lib/kpi/trends', () => ({
  fetchTrendSeries: vi.fn(),
}));

import { fetchTrendSeries } from '@/lib/kpi/trends';

const mockedFetchTrendSeries = vi.mocked(fetchTrendSeries);

function buildRequest(params: Record<string, string>): NextRequest {
  const url = new URL('http://localhost/api/kpis/trends');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new NextRequest(url.toString());
}

describe('GET /api/kpis/trends', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('given valid organizationId and metrics params', () => {
    it('returns 200 with a TrendsApiResponse shape', async () => {
      mockedFetchTrendSeries.mockResolvedValue([mockRevenueSeries, mockProfitSeries]);

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        metrics: 'total_revenue,net_profit',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toHaveProperty('trends');
      expect(body).toHaveProperty('periodType');
      expect(body).toHaveProperty('organizationId');
      expect(body.organizationId).toBe('org-1');
      expect(body.trends).toHaveLength(2);
    });
  });

  describe('given organizationId query param is absent', () => {
    it('returns 400 with a validation error message', async () => {
      const { GET } = await import('./route');
      const request = buildRequest({ metrics: 'total_revenue' });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toHaveProperty('error');
    });
  });

  describe('given metrics query param is absent', () => {
    it('returns 400 with a validation error message', async () => {
      const { GET } = await import('./route');
      const request = buildRequest({ organizationId: 'org-1' });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toHaveProperty('error');
    });
  });

  describe('given fetchTrendSeries returns series with empty dataPoints', () => {
    it('returns 200 with trends array containing the empty series', async () => {
      mockedFetchTrendSeries.mockResolvedValue([mockEmptySeries]);

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        metrics: 'total_revenue',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.trends).toHaveLength(1);
      expect(body.trends[0].dataPoints).toEqual([]);
    });
  });

  describe('given fetchTrendSeries throws an unexpected error', () => {
    it('returns 500 without leaking internal error details', async () => {
      mockedFetchTrendSeries.mockRejectedValue(new Error('DB connection refused: secret-host:5432'));

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        metrics: 'total_revenue',
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
