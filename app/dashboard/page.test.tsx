import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPage from './page';

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
      ],
    },
    {
      metricName: 'net_profit',
      displayName: 'Net Profit',
      unit: 'currency',
      dataPoints: [
        { periodId: 'p1', label: 'Jan 2026', value: 18000, unit: 'currency' },
        { periodId: 'p2', label: 'Feb 2026', value: 20000, unit: 'currency' },
      ],
    },
  ],
  periodType: 'monthly',
  organizationId: 'org-1',
};

const emptyTrendsResponse = {
  trends: [
    { metricName: 'total_revenue', displayName: 'Total Revenue', unit: 'currency', dataPoints: [] },
    { metricName: 'net_profit', displayName: 'Net Profit', unit: 'currency', dataPoints: [] },
  ],
  periodType: 'monthly',
  organizationId: 'org-1',
};

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

describe('Executive Dashboard', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('given trends data loads successfully', () => {
    it('renders a trends section with revenue and profit charts', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validTrendsResponse,
      });

      render(<DashboardPage />);

      const section = await screen.findByTestId('executive-trends-section');
      expect(section).toBeInTheDocument();
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('Net Profit')).toBeInTheDocument();
    });
  });

  describe('given trends are still loading', () => {
    it('shows loading state while trends are fetching', () => {
      mockFetch.mockReturnValueOnce(new Promise(() => {})); // never resolves

      render(<DashboardPage />);

      expect(screen.getByTestId('trends-loading')).toBeInTheDocument();
    });
  });

  describe('given no trend data is available', () => {
    it('shows empty state when API returns empty trends', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => emptyTrendsResponse,
      });

      render(<DashboardPage />);

      const emptyState = await screen.findByTestId('trend-chart-empty');
      expect(emptyState).toBeInTheDocument();
    });
  });

  describe('given the API returns an error', () => {
    it('shows error state when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      render(<DashboardPage />);

      const errorState = await screen.findByTestId('trends-error');
      expect(errorState).toBeInTheDocument();
    });
  });
});
