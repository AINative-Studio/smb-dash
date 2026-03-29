import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

import CashFlowPage from './page';

const validTrendsResponse = {
  trends: [
    {
      metricName: 'net_cash_flow',
      displayName: 'Net Cash Flow',
      unit: 'currency',
      dataPoints: [
        { periodId: 'p1', label: 'Jan 2026', value: 28000, unit: 'currency' },
        { periodId: 'p2', label: 'Feb 2026', value: 32000, unit: 'currency' },
      ],
    },
    {
      metricName: 'cash_inflow',
      displayName: 'Cash Inflow',
      unit: 'currency',
      dataPoints: [
        { periodId: 'p1', label: 'Jan 2026', value: 120000, unit: 'currency' },
        { periodId: 'p2', label: 'Feb 2026', value: 135000, unit: 'currency' },
      ],
    },
    {
      metricName: 'cash_outflow',
      displayName: 'Cash Outflow',
      unit: 'currency',
      dataPoints: [
        { periodId: 'p1', label: 'Jan 2026', value: 92000, unit: 'currency' },
        { periodId: 'p2', label: 'Feb 2026', value: 103000, unit: 'currency' },
      ],
    },
  ],
  periodType: 'monthly',
  organizationId: 'org-1',
};

const validSummaryResponse = {
  cards: [
    {
      metricName: 'cash_on_hand',
      displayName: 'Cash on Hand',
      value: 250000,
      unit: 'currency',
      delta: { absoluteDelta: 15000, percentDelta: 6.38, comparisonType: 'prior_period' },
    },
    {
      metricName: 'runway_months',
      displayName: 'Runway',
      value: 14,
      unit: 'months',
      delta: { absoluteDelta: -2, percentDelta: -12.5, comparisonType: 'prior_period' },
    },
  ],
  organizationId: 'org-1',
  periodType: 'monthly',
};

const emptySummaryResponse = {
  cards: [],
  organizationId: 'org-1',
  periodType: 'monthly',
};

describe('Cash Flow Page', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('given all data loads successfully', () => {
    it('renders the Cash Flow page heading', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => validTrendsResponse })
        .mockResolvedValueOnce({ ok: true, json: async () => validSummaryResponse });

      render(<CashFlowPage />);

      const heading = await screen.findByRole('heading', { name: /cash flow/i });
      expect(heading).toBeInTheDocument();
    });

    it('renders the trend chart section', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => validTrendsResponse })
        .mockResolvedValueOnce({ ok: true, json: async () => validSummaryResponse });

      render(<CashFlowPage />);

      const section = await screen.findByTestId('cashflow-trends-section');
      expect(section).toBeInTheDocument();
    });

    it('renders the net cash flow trend series label', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => validTrendsResponse })
        .mockResolvedValueOnce({ ok: true, json: async () => validSummaryResponse });

      render(<CashFlowPage />);

      expect(await screen.findByText('Net Cash Flow')).toBeInTheDocument();
    });

    it('renders cash on hand summary card', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => validTrendsResponse })
        .mockResolvedValueOnce({ ok: true, json: async () => validSummaryResponse });

      render(<CashFlowPage />);

      expect(await screen.findByText('Cash on Hand')).toBeInTheDocument();
    });

    it('renders runway summary card', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => validTrendsResponse })
        .mockResolvedValueOnce({ ok: true, json: async () => validSummaryResponse });

      render(<CashFlowPage />);

      expect(await screen.findByText('Runway')).toBeInTheDocument();
    });

    it('renders the summary cards section', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => validTrendsResponse })
        .mockResolvedValueOnce({ ok: true, json: async () => validSummaryResponse });

      render(<CashFlowPage />);

      const section = await screen.findByTestId('cashflow-summary-section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('given data is still loading', () => {
    it('shows a loading indicator', () => {
      mockFetch.mockReturnValue(new Promise(() => {}));

      render(<CashFlowPage />);

      expect(screen.getByTestId('cashflow-loading')).toBeInTheDocument();
    });
  });

  describe('given the trends API returns an error', () => {
    it('shows an error state', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 500 })
        .mockResolvedValueOnce({ ok: true, json: async () => validSummaryResponse });

      render(<CashFlowPage />);

      expect(await screen.findByTestId('cashflow-error')).toBeInTheDocument();
    });
  });

  describe('given the summary API returns an empty cards array', () => {
    it('renders the summary section with fallback state', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => validTrendsResponse })
        .mockResolvedValueOnce({ ok: true, json: async () => emptySummaryResponse });

      render(<CashFlowPage />);

      expect(await screen.findByTestId('cashflow-summary-empty')).toBeInTheDocument();
    });
  });
});
