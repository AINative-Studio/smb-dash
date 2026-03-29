import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

const mockFetch = vi.fn();
global.fetch = mockFetch;

import ArApPage from './page';

const validSummaryResponse = {
  cards: [
    {
      metricName: 'ar_balance',
      displayName: 'AR Balance',
      value: 87500,
      unit: 'currency',
      delta: { absoluteDelta: -5000, percentDelta: -5.41, comparisonType: 'prior_period' },
    },
    {
      metricName: 'ap_balance',
      displayName: 'AP Balance',
      value: 43200,
      unit: 'currency',
      delta: { absoluteDelta: 3200, percentDelta: 8.0, comparisonType: 'prior_period' },
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

describe('AR/AP Page', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('given data loads successfully', () => {
    it('renders the AR/AP page heading', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validSummaryResponse,
      });

      render(<ArApPage />);

      const heading = await screen.findByRole('heading', { name: /accounts receivable/i });
      expect(heading).toBeInTheDocument();
    });

    it('renders the AR Balance summary card', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validSummaryResponse,
      });

      render(<ArApPage />);

      expect(await screen.findByText('AR Balance')).toBeInTheDocument();
    });

    it('renders the AP Balance summary card', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validSummaryResponse,
      });

      render(<ArApPage />);

      expect(await screen.findByText('AP Balance')).toBeInTheDocument();
    });

    it('renders the summary cards section', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validSummaryResponse,
      });

      render(<ArApPage />);

      expect(await screen.findByTestId('arap-summary-section')).toBeInTheDocument();
    });

    it('renders AR Balance card with a link to the aging table', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validSummaryResponse,
      });

      render(<ArApPage />);

      await screen.findByTestId('arap-summary-section');
      const arLinks = screen.getAllByRole('link', { name: /ar balance/i });
      expect(arLinks.length).toBeGreaterThan(0);
      expect(arLinks[0]).toHaveAttribute('href', expect.stringContaining('ar'));
    });

    it('renders AP Balance card with a link to the aging table', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => validSummaryResponse,
      });

      render(<ArApPage />);

      await screen.findByTestId('arap-summary-section');
      const apLinks = screen.getAllByRole('link', { name: /ap balance/i });
      expect(apLinks.length).toBeGreaterThan(0);
      expect(apLinks[0]).toHaveAttribute('href', expect.stringContaining('ap'));
    });
  });

  describe('given data is still loading', () => {
    it('shows a loading indicator', () => {
      mockFetch.mockReturnValue(new Promise(() => {}));

      render(<ArApPage />);

      expect(screen.getByTestId('arap-loading')).toBeInTheDocument();
    });
  });

  describe('given the API returns an error', () => {
    it('shows an error state', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      render(<ArApPage />);

      expect(await screen.findByTestId('arap-error')).toBeInTheDocument();
    });
  });

  describe('given the API returns an empty cards array', () => {
    it('renders a fallback empty state', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => emptySummaryResponse,
      });

      render(<ArApPage />);

      expect(await screen.findByTestId('arap-summary-empty')).toBeInTheDocument();
    });
  });
});
