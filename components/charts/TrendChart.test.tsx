import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import {
  mockRevenueSeries,
  mockProfitSeries,
  mockEmptySeries,
} from '@/__tests__/fixtures/trends';
import { TrendSeries } from '@/types/trends';

vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

import { TrendChart } from './TrendChart';

describe('TrendChart', () => {
  describe('given a TrendSeries with 3 data points', () => {
    it('renders chart container with data-testid="trend-chart"', () => {
      // Arrange
      // Act
      render(<TrendChart series={[mockRevenueSeries]} />);
      // Assert
      expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
    });
  });

  describe('given 2 series (revenue + profit)', () => {
    it('renders the chart container', () => {
      // Arrange
      // Act
      render(<TrendChart series={[mockRevenueSeries, mockProfitSeries]} />);
      // Assert
      expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
    });

    it('renders both metric display names in the document', () => {
      // Arrange
      // Act
      render(<TrendChart series={[mockRevenueSeries, mockProfitSeries]} />);
      // Assert
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('Net Profit')).toBeInTheDocument();
    });
  });

  describe('given a series with empty dataPoints', () => {
    it('renders empty state with data-testid="trend-chart-empty"', () => {
      // Arrange
      // Act
      render(<TrendChart series={[mockEmptySeries]} />);
      // Assert
      expect(screen.getByTestId('trend-chart-empty')).toBeInTheDocument();
    });

    it('does NOT render an svg chart', () => {
      // Arrange
      // Act
      render(<TrendChart series={[mockEmptySeries]} />);
      // Assert
      expect(screen.queryByTestId('trend-chart')).not.toBeInTheDocument();
    });
  });

  describe('given an empty series array', () => {
    it('renders empty state with data-testid="trend-chart-empty"', () => {
      // Arrange
      // Act
      render(<TrendChart series={[]} />);
      // Assert
      expect(screen.getByTestId('trend-chart-empty')).toBeInTheDocument();
    });

    it('does NOT render the chart container', () => {
      // Arrange
      // Act
      render(<TrendChart series={[]} />);
      // Assert
      expect(screen.queryByTestId('trend-chart')).not.toBeInTheDocument();
    });
  });

  describe('given series with only 2 non-consecutive data points', () => {
    it('renders without throwing', () => {
      // Arrange
      const sparseSeries: TrendSeries = {
        metricName: 'total_revenue',
        displayName: 'Total Revenue',
        unit: 'currency',
        dataPoints: [
          { periodId: 'p1', label: 'Jan 2026', value: 100000, unit: 'currency' },
          { periodId: 'p3', label: 'Mar 2026', value: 125000, unit: 'currency' },
        ],
      };
      // Act & Assert — no error thrown
      expect(() => render(<TrendChart series={[sparseSeries]} />)).not.toThrow();
    });

    it('renders the chart container', () => {
      // Arrange
      const sparseSeries: TrendSeries = {
        metricName: 'total_revenue',
        displayName: 'Total Revenue',
        unit: 'currency',
        dataPoints: [
          { periodId: 'p1', label: 'Jan 2026', value: 100000, unit: 'currency' },
          { periodId: 'p3', label: 'Mar 2026', value: 125000, unit: 'currency' },
        ],
      };
      // Act
      render(<TrendChart series={[sparseSeries]} />);
      // Assert
      expect(screen.getByTestId('trend-chart')).toBeInTheDocument();
    });
  });

  describe('given a series with a displayName', () => {
    it('displays the metric display name "Total Revenue"', () => {
      // Arrange
      // Act
      render(<TrendChart series={[mockRevenueSeries]} />);
      // Assert
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    });
  });
});
