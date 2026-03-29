import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock recharts ResponsiveContainer for test environment
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

const mockFetch = vi.fn();
global.fetch = mockFetch;

const validTrendsResponse = {
  trends: [
    {
      metricName: 'total_revenue',
      displayName: 'Total Revenue',
      unit: 'currency',
      dataPoints: [
        { periodId: 'p1', label: 'Jan 2026', value: 100000, unit: 'currency' },
        { periodId: 'p2', label: 'Feb 2026', value: 112000, unit: 'currency' },
        { periodId: 'p3', label: 'Mar 2026', value: 125000, unit: 'currency' },
      ],
    },
  ],
  periodType: 'monthly',
  organizationId: 'org-1',
};

const validBreakdownByCustomerResponse = {
  rows: [
    {
      customerId: 'cust-1',
      customerName: 'Acme Corp',
      revenueAmount: 45000,
      invoiceCount: 9,
      avgInvoiceValue: 5000,
      paymentCollectedAmount: 45000,
    },
    {
      customerId: 'cust-2',
      customerName: 'Beta Inc',
      revenueAmount: 30000,
      invoiceCount: 6,
      avgInvoiceValue: 5000,
      paymentCollectedAmount: 28000,
    },
  ],
  groupBy: 'customer',
  organizationId: 'org-1',
  periodType: 'monthly',
};

const validBreakdownByProductResponse = {
  rows: [
    {
      productId: 'prod-1',
      productName: 'Widget Pro',
      revenueAmount: 50000,
      invoiceCount: 10,
      avgInvoiceValue: 5000,
      paymentCollectedAmount: 50000,
    },
  ],
  groupBy: 'product',
  organizationId: 'org-1',
  periodType: 'monthly',
};

import RevenuePage from './page';

describe('Revenue Dashboard Page', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('given all data loads successfully', () => {
    it('renders the Revenue Dashboard heading', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validTrendsResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByCustomerResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByProductResponse,
      });

      render(<RevenuePage />);

      const heading = await screen.findByRole('heading', { name: /Revenue Dashboard/i });
      expect(heading).toBeInTheDocument();
    });

    it('renders the revenue trend section once loaded', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validTrendsResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByCustomerResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByProductResponse,
      });

      render(<RevenuePage />);

      const trendSection = await screen.findByTestId('revenue-trend-section');
      expect(trendSection).toBeInTheDocument();
    });

    it('renders the customer breakdown section once loaded', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validTrendsResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByCustomerResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByProductResponse,
      });

      render(<RevenuePage />);

      const customerSection = await screen.findByTestId('customer-breakdown-section');
      expect(customerSection).toBeInTheDocument();
    });

    it('renders the product breakdown section once loaded', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validTrendsResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByCustomerResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByProductResponse,
      });

      render(<RevenuePage />);

      const productSection = await screen.findByTestId('product-breakdown-section');
      expect(productSection).toBeInTheDocument();
    });

    it('shows revenue growth percentage when current and prior period exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validTrendsResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByCustomerResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByProductResponse,
      });

      render(<RevenuePage />);

      const growthBadge = await screen.findByTestId('revenue-growth-badge');
      expect(growthBadge).toBeInTheDocument();
    });

    it('displays customer names in the breakdown table', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validTrendsResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByCustomerResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByProductResponse,
      });

      render(<RevenuePage />);

      expect(await screen.findByText('Acme Corp')).toBeInTheDocument();
      expect(screen.getByText('Beta Inc')).toBeInTheDocument();
    });
  });

  describe('given data is still loading', () => {
    it('shows loading state while data is fetching', () => {
      mockFetch.mockReturnValue(new Promise(() => {})); // never resolves

      render(<RevenuePage />);

      expect(screen.getByTestId('revenue-loading')).toBeInTheDocument();
    });
  });

  describe('given trend data returns empty', () => {
    it('shows the trend chart empty state', async () => {
      const emptyTrendResponse = {
        trends: [
          {
            metricName: 'total_revenue',
            displayName: 'Total Revenue',
            unit: 'currency',
            dataPoints: [],
          },
        ],
        periodType: 'monthly',
        organizationId: 'org-1',
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => emptyTrendResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ rows: [], groupBy: 'customer', organizationId: 'org-1', periodType: 'monthly' }),
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ rows: [], groupBy: 'product', organizationId: 'org-1', periodType: 'monthly' }),
      });

      render(<RevenuePage />);

      const emptyChart = await screen.findByTestId('trend-chart-empty');
      expect(emptyChart).toBeInTheDocument();
    });
  });

  describe('given the trends API returns an error', () => {
    it('shows an error state when the trends fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByCustomerResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByProductResponse,
      });

      render(<RevenuePage />);

      const errorState = await screen.findByTestId('revenue-error');
      expect(errorState).toBeInTheDocument();
    });
  });

  describe('given no growth data (only one data point)', () => {
    it('does not render a revenue growth badge', async () => {
      const singlePointTrend = {
        trends: [
          {
            metricName: 'total_revenue',
            displayName: 'Total Revenue',
            unit: 'currency',
            dataPoints: [
              { periodId: 'p1', label: 'Jan 2026', value: 100000, unit: 'currency' },
            ],
          },
        ],
        periodType: 'monthly',
        organizationId: 'org-1',
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => singlePointTrend,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByCustomerResponse,
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validBreakdownByProductResponse,
      });

      render(<RevenuePage />);

      await screen.findByTestId('revenue-trend-section');
      expect(screen.queryByTestId('revenue-growth-badge')).not.toBeInTheDocument();
    });
  });
});
