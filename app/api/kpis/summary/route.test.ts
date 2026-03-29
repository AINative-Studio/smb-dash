import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import {
  mockCashOnHandCard,
  mockRunwayCard,
  mockArBalanceCard,
  mockApBalanceCard,
} from '@/__tests__/fixtures/summary';

vi.mock('@/lib/kpi/summary', () => ({
  fetchSummaryCards: vi.fn(),
}));

import { fetchSummaryCards } from '@/lib/kpi/summary';

const mockedFetchSummaryCards = vi.mocked(fetchSummaryCards);

function buildRequest(params: Record<string, string>): NextRequest {
  const url = new URL('http://localhost/api/kpis/summary');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new NextRequest(url.toString());
}

describe('GET /api/kpis/summary', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('given valid organizationId and metrics params', () => {
    it('returns 200 with a SummaryApiResponse shape', async () => {
      mockedFetchSummaryCards.mockResolvedValue([mockCashOnHandCard, mockRunwayCard]);

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        metrics: 'cash_on_hand,runway_months',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toHaveProperty('cards');
      expect(body).toHaveProperty('organizationId');
      expect(body).toHaveProperty('periodType');
      expect(body.organizationId).toBe('org-1');
      expect(body.cards).toHaveLength(2);
    });
  });

  describe('given includeComparison param is present', () => {
    it('passes includeComparison=true to fetchSummaryCards', async () => {
      mockedFetchSummaryCards.mockResolvedValue([mockArBalanceCard, mockApBalanceCard]);

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        metrics: 'ar_balance,ap_balance',
        includeComparison: 'true',
      });

      await GET(request);

      expect(mockedFetchSummaryCards).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ includeComparison: true })
      );
    });
  });

  describe('given organizationId query param is absent', () => {
    it('returns 400 with a validation error message', async () => {
      const { GET } = await import('./route');
      const request = buildRequest({ metrics: 'cash_on_hand' });

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

  describe('given fetchSummaryCards returns an empty array', () => {
    it('returns 200 with an empty cards array', async () => {
      mockedFetchSummaryCards.mockResolvedValue([]);

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        metrics: 'cash_on_hand',
      });

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.cards).toEqual([]);
    });
  });

  describe('given fetchSummaryCards throws an unexpected error', () => {
    it('returns 500 without leaking internal error details', async () => {
      mockedFetchSummaryCards.mockRejectedValue(
        new Error('DB connection refused: secret-host:5432')
      );

      const { GET } = await import('./route');
      const request = buildRequest({
        organizationId: 'org-1',
        metrics: 'cash_on_hand',
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
