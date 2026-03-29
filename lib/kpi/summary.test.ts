import { describe, it, expect, vi } from 'vitest';
import { fetchSummaryCards } from './summary';
import type { ZeroDBClient } from '@/lib/zerodb/client';
import {
  mockSummaryMetricRows,
  mockOtherOrgMetricRows,
  mockComparisonRows,
} from '@/__tests__/fixtures/summary';

function createMockClient(overrides?: {
  metricRows?: typeof mockSummaryMetricRows;
  comparisonRows?: typeof mockComparisonRows;
}): ZeroDBClient {
  const metricRows = overrides?.metricRows ?? mockSummaryMetricRows;
  const comparisonRows = overrides?.comparisonRows ?? mockComparisonRows;

  return {
    query: vi.fn(async (table: string, filters: Record<string, unknown>) => {
      if (table === 'fact_financial_metrics') {
        const orgId = filters.organization_id;
        const metricNames = filters.metric_name as string[] | undefined;
        let rows = metricRows.filter((r) => r.organization_id === orgId);
        if (metricNames) {
          rows = rows.filter((r) => metricNames.includes(r.metric_name));
        }
        return { rows };
      }
      if (table === 'fact_kpi_comparisons') {
        const orgId = filters.organization_id;
        const metricNames = filters.metric_name as string[] | undefined;
        let rows = comparisonRows.filter((r) => r.organization_id === orgId);
        if (metricNames) {
          rows = rows.filter((r) => metricNames.includes(r.metric_name));
        }
        return { rows };
      }
      return { rows: [] };
    }),
  };
}

describe('fetchSummaryCards', () => {
  describe('given metric data exists for the requested metrics', () => {
    it('returns a SummaryCard for each requested metric', async () => {
      const client = createMockClient();

      const result = await fetchSummaryCards(client, {
        organizationId: 'org-1',
        metricNames: ['cash_on_hand', 'runway_months'],
      });

      expect(result).toHaveLength(2);
      const names = result.map((c) => c.metricName);
      expect(names).toContain('cash_on_hand');
      expect(names).toContain('runway_months');
    });

    it('populates value and unit from fact_financial_metrics', async () => {
      const client = createMockClient();

      const result = await fetchSummaryCards(client, {
        organizationId: 'org-1',
        metricNames: ['cash_on_hand'],
      });

      expect(result[0].value).toBe(250000);
      expect(result[0].unit).toBe('currency');
    });

    it('sets a human-readable displayName', async () => {
      const client = createMockClient();

      const result = await fetchSummaryCards(client, {
        organizationId: 'org-1',
        metricNames: ['runway_months'],
      });

      expect(result[0].displayName).toBe('Runway');
    });
  });

  describe('given comparison data exists', () => {
    it('attaches delta info to the card when includeComparison is true', async () => {
      const client = createMockClient();

      const result = await fetchSummaryCards(client, {
        organizationId: 'org-1',
        metricNames: ['cash_on_hand'],
        includeComparison: true,
      });

      expect(result[0].delta).toBeDefined();
      expect(result[0].delta?.absoluteDelta).toBe(15000);
      expect(result[0].delta?.percentDelta).toBe(6.38);
      expect(result[0].delta?.comparisonType).toBe('prior_period');
    });

    it('omits delta when includeComparison is false', async () => {
      const client = createMockClient();

      const result = await fetchSummaryCards(client, {
        organizationId: 'org-1',
        metricNames: ['cash_on_hand'],
        includeComparison: false,
      });

      expect(result[0].delta).toBeUndefined();
    });

    it('omits delta when includeComparison is not provided', async () => {
      const client = createMockClient();

      const result = await fetchSummaryCards(client, {
        organizationId: 'org-1',
        metricNames: ['cash_on_hand'],
      });

      expect(result[0].delta).toBeUndefined();
    });
  });

  describe('given no comparison data exists for a metric', () => {
    it('returns the card without a delta field', async () => {
      const client = createMockClient({ comparisonRows: [] });

      const result = await fetchSummaryCards(client, {
        organizationId: 'org-1',
        metricNames: ['net_cash_flow'],
        includeComparison: true,
      });

      expect(result[0].delta).toBeUndefined();
    });
  });

  describe('given no metric data exists', () => {
    it('returns an empty array', async () => {
      const client = createMockClient({ metricRows: [] });

      const result = await fetchSummaryCards(client, {
        organizationId: 'org-1',
        metricNames: ['cash_on_hand'],
      });

      expect(result).toEqual([]);
    });
  });

  describe('given data for multiple organizations', () => {
    it('only returns cards for the specified organizationId', async () => {
      const allRows = [...mockSummaryMetricRows, ...mockOtherOrgMetricRows];
      const client = createMockClient({ metricRows: allRows });

      const result = await fetchSummaryCards(client, {
        organizationId: 'org-1',
        metricNames: ['cash_on_hand'],
      });

      expect(result).toHaveLength(1);
      expect(result[0].value).toBe(250000);
    });
  });

  describe('given metrics with negative delta', () => {
    it('preserves negative absoluteDelta on the card', async () => {
      const client = createMockClient();

      const result = await fetchSummaryCards(client, {
        organizationId: 'org-1',
        metricNames: ['runway_months'],
        includeComparison: true,
      });

      expect(result[0].delta?.absoluteDelta).toBe(-2);
      expect(result[0].delta?.percentDelta).toBe(-12.5);
    });
  });
});
