import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpensesPage from './page';

const mockFetch = vi.fn();
global.fetch = mockFetch;

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

const validTrendResponse = {
  trends: [
    {
      metricName: 'total_expenses',
      displayName: 'Total Expenses',
      unit: 'currency',
      dataPoints: [
        { periodId: 'p1', label: 'Jan 2026', value: 100700, unit: 'currency' },
        { periodId: 'p2', label: 'Feb 2026', value: 98500, unit: 'currency' },
      ],
    },
  ],
  periodType: 'monthly',
  organizationId: 'org-1',
};

const emptytrendResponse = {
  trends: [
    {
      metricName: 'total_expenses',
      displayName: 'Total Expenses',
      unit: 'currency',
      dataPoints: [],
    },
  ],
  periodType: 'monthly',
  organizationId: 'org-1',
};

const validCategoryBreakdownResponse = {
  rows: [
    {
      categoryId: 'cat-1',
      categoryName: 'Software & Subscriptions',
      expenseAmount: 12500,
      transactionCount: 8,
      avgTransactionAmount: 1562.5,
    },
    {
      categoryId: 'cat-2',
      categoryName: 'Payroll',
      expenseAmount: 85000,
      transactionCount: 2,
      avgTransactionAmount: 42500,
    },
  ],
  groupBy: 'category',
  organizationId: 'org-1',
  periodType: 'monthly',
};

const validVendorBreakdownResponse = {
  rows: [
    {
      vendorId: 'v-1',
      vendorName: 'Acme Corp',
      expenseAmount: 22000,
      transactionCount: 5,
      avgTransactionAmount: 4400,
    },
    {
      vendorId: 'v-2',
      vendorName: 'Office Depot',
      expenseAmount: 3200,
      transactionCount: 12,
      avgTransactionAmount: 266.67,
    },
  ],
  groupBy: 'vendor',
  organizationId: 'org-1',
  periodType: 'monthly',
};

const emptyBreakdownResponse = {
  rows: [],
  groupBy: 'category',
  organizationId: 'org-1',
  periodType: 'monthly',
};

function mockBothApiCallsSuccess() {
  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => validTrendResponse,
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => validCategoryBreakdownResponse,
    });
}

describe('Expense Dashboard', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  // -------------------------------------------------------------------------
  // Loading states
  // -------------------------------------------------------------------------

  describe('given both API calls are still pending', () => {
    it('shows a loading indicator', () => {
      mockFetch.mockReturnValue(new Promise(() => {})); // never resolves

      render(<ExpensesPage />);

      expect(screen.getByTestId('expenses-loading')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Loaded states — trend
  // -------------------------------------------------------------------------

  describe('given trend data loads successfully', () => {
    it('renders the expense trend chart section', async () => {
      mockBothApiCallsSuccess();

      render(<ExpensesPage />);

      const section = await screen.findByTestId('expense-trend-section');
      expect(section).toBeInTheDocument();
    });

    it('shows Total Expenses as the chart legend entry', async () => {
      mockBothApiCallsSuccess();

      render(<ExpensesPage />);

      expect(await screen.findByText('Total Expenses')).toBeInTheDocument();
    });
  });

  describe('given the trend API returns empty data', () => {
    it('shows the chart empty state', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => emptytrendResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => validCategoryBreakdownResponse,
        });

      render(<ExpensesPage />);

      expect(await screen.findByTestId('trend-chart-empty')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Loaded states — breakdown table (default = category)
  // -------------------------------------------------------------------------

  describe('given category breakdown data loads successfully', () => {
    it('renders the breakdown table section', async () => {
      mockBothApiCallsSuccess();

      render(<ExpensesPage />);

      const section = await screen.findByTestId('expense-breakdown-section');
      expect(section).toBeInTheDocument();
    });

    it('renders a row for each category', async () => {
      mockBothApiCallsSuccess();

      render(<ExpensesPage />);

      expect(await screen.findByText('Software & Subscriptions')).toBeInTheDocument();
      expect(await screen.findByText('Payroll')).toBeInTheDocument();
    });

    it('displays the formatted expense amount for each category', async () => {
      mockBothApiCallsSuccess();

      render(<ExpensesPage />);

      await screen.findByTestId('expense-breakdown-section');
      // $85,000 formatted
      expect(screen.getByText('$85,000')).toBeInTheDocument();
    });
  });

  describe('given breakdown data is empty', () => {
    it('shows an empty state in the breakdown section', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => validTrendResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => emptyBreakdownResponse,
        });

      render(<ExpensesPage />);

      expect(await screen.findByTestId('expense-breakdown-empty')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Vendor tab / filter
  // -------------------------------------------------------------------------

  describe('given the user switches to the vendor breakdown tab', () => {
    it('fetches vendor breakdown data and renders vendor names', async () => {
      // First render: trend + category
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => validTrendResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => validCategoryBreakdownResponse,
        })
        // After clicking vendor tab
        .mockResolvedValueOnce({
          ok: true,
          json: async () => validVendorBreakdownResponse,
        });

      render(<ExpensesPage />);

      // Wait for initial load
      await screen.findByTestId('expense-breakdown-section');

      const vendorTab = screen.getByRole('button', { name: /vendor/i });
      await userEvent.click(vendorTab);

      expect(await screen.findByText('Acme Corp')).toBeInTheDocument();
      expect(await screen.findByText('Office Depot')).toBeInTheDocument();
    });
  });

  describe('given the user switches to the category breakdown tab', () => {
    it('shows a tab button labelled Category', async () => {
      mockBothApiCallsSuccess();

      render(<ExpensesPage />);

      await screen.findByTestId('expense-breakdown-section');

      expect(screen.getByRole('button', { name: /category/i })).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Vendor empty state
  // -------------------------------------------------------------------------

  describe('given vendor breakdown returns no rows', () => {
    it('shows the empty state after switching to vendor tab', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => validTrendResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => validCategoryBreakdownResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => { return { rows: [], groupBy: 'vendor', organizationId: 'org-1', periodType: 'monthly' }; },
        });

      render(<ExpensesPage />);

      await screen.findByTestId('expense-breakdown-section');

      const vendorTab = screen.getByRole('button', { name: /vendor/i });
      await userEvent.click(vendorTab);

      expect(await screen.findByTestId('expense-breakdown-empty')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Error states
  // -------------------------------------------------------------------------

  describe('given the trend API returns an HTTP error', () => {
    it('shows an error state for the trend section', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 500 })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => validCategoryBreakdownResponse,
        });

      render(<ExpensesPage />);

      expect(await screen.findByTestId('expense-trend-error')).toBeInTheDocument();
    });
  });

  describe('given the breakdown API returns an HTTP error', () => {
    it('shows an error state for the breakdown section', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => validTrendResponse,
        })
        .mockResolvedValueOnce({ ok: false, status: 500 });

      render(<ExpensesPage />);

      expect(await screen.findByTestId('expense-breakdown-error')).toBeInTheDocument();
    });
  });
});
