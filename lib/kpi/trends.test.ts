import { describe, it, expect, vi } from 'vitest';
import { fetchTrendSeries } from './trends';
import type { ZeroDBClient } from '@/lib/zerodb/client';
import {
  mockTrendRows,
  mockPeriods,
  mockOtherOrgTrendRows,
  mockSparseTrendRows,
  mockQuarterlyPeriods,
} from '@/__tests__/fixtures/trends';

function createMockClient(overrides?: {
  trendRows?: typeof mockTrendRows;
  periodRows?: typeof mockPeriods;
}): ZeroDBClient {
  const trendRows = overrides?.trendRows ?? mockTrendRows;
  const periodRows = overrides?.periodRows ?? mockPeriods;

  return {
    query: vi.fn(async (table: string, filters: Record<string, unknown>) => {
      if (table === 'fact_metric_trends') {
        const orgId = filters.organization_id;
        const metricNames = filters.metric_name as string[] | undefined;
        let rows = trendRows.filter((r) => r.organization_id === orgId);
        if (metricNames) {
          rows = rows.filter((r) => metricNames.includes(r.metric_name));
        }
        return { rows };
      }
      if (table === 'dashboard_periods') {
        const orgId = filters.organization_id;
        const periodType = filters.period_type;
        let rows = periodRows.filter(
          (r) => r.organizationId === orgId
        );
        if (periodType) {
          rows = rows.filter((r) => r.periodType === periodType);
        }
        return {
          rows: rows.map((r) => ({
            id: r.id,
            organization_id: r.organizationId,
            period_type: r.periodType,
            period_start: r.periodStart,
            period_end: r.periodEnd,
            label: r.label,
            is_closed: r.isClosed,
          })),
        };
      }
      return { rows: [] };
    }),
  };
}

describe('fetchTrendSeries', () => {
  describe('given metric data exists for multiple periods', () => {
    it('returns an ordered array of TrendDataPoints for the requested metric', async () => {
      const client = createMockClient();
      const result = await fetchTrendSeries(client, {
        organizationId: 'org-1',
        metricNames: ['total_revenue'],
        periodType: 'monthly',
      });

      expect(result).toHaveLength(1);
      expect(result[0].metricName).toBe('total_revenue');
      expect(result[0].dataPoints).toHaveLength(3);
      expect(result[0].dataPoints[0].value).toBe(100000);
      expect(result[0].dataPoints[1].value).toBe(112000);
      expect(result[0].dataPoints[2].value).toBe(125000);
    });
  });

  describe('given multiple metrics requested', () => {
    it('returns separate TrendSeries for each metric', async () => {
      const client = createMockClient();
      const result = await fetchTrendSeries(client, {
        organizationId: 'org-1',
        metricNames: ['total_revenue', 'net_profit'],
        periodType: 'monthly',
      });

      expect(result).toHaveLength(2);
      const names = result.map((s) => s.metricName);
      expect(names).toContain('total_revenue');
      expect(names).toContain('net_profit');
    });
  });

  describe('given no metric data exists', () => {
    it('returns a TrendSeries with empty dataPoints array', async () => {
      const client = createMockClient({ trendRows: [] });
      const result = await fetchTrendSeries(client, {
        organizationId: 'org-1',
        metricNames: ['total_revenue'],
        periodType: 'monthly',
      });

      expect(result).toHaveLength(1);
      expect(result[0].dataPoints).toEqual([]);
    });
  });

  describe('given sparse data with missing periods', () => {
    it('includes only periods that have data', async () => {
      const client = createMockClient({ trendRows: mockSparseTrendRows });
      const result = await fetchTrendSeries(client, {
        organizationId: 'org-1',
        metricNames: ['total_revenue'],
        periodType: 'monthly',
      });

      expect(result[0].dataPoints).toHaveLength(2);
      expect(result[0].dataPoints[0].label).toBe('Jan 2026');
      expect(result[0].dataPoints[1].label).toBe('Mar 2026');
    });
  });

  describe('given quarterly periods', () => {
    it('uses the label field from dashboard_periods', async () => {
      const quarterlyTrend = [
        { id: 'qt1', organization_id: 'org-1', metric_name: 'total_revenue', period_id: 'q1', metric_value: 337000, metric_unit: 'currency', series_key: null, created_at: '2026-03-31T00:00:00Z' },
      ];
      const client = createMockClient({
        trendRows: quarterlyTrend,
        periodRows: mockQuarterlyPeriods,
      });
      const result = await fetchTrendSeries(client, {
        organizationId: 'org-1',
        metricNames: ['total_revenue'],
        periodType: 'quarterly',
      });

      expect(result[0].dataPoints[0].label).toBe('Q1 2026');
    });
  });

  describe('given data for multiple organizations', () => {
    it('only returns data for the specified organizationId', async () => {
      const allRows = [...mockTrendRows, ...mockOtherOrgTrendRows];
      const client = createMockClient({ trendRows: allRows });
      const result = await fetchTrendSeries(client, {
        organizationId: 'org-1',
        metricNames: ['total_revenue'],
        periodType: 'monthly',
      });

      expect(result).toHaveLength(1);
      expect(result[0].dataPoints).toHaveLength(3);
      // All values belong to org-1, not org-2's 50000
      result[0].dataPoints.forEach((dp) => {
        expect(dp.value).not.toBe(50000);
      });
    });
  });
});
