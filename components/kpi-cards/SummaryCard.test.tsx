import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { SummaryCard } from './SummaryCard';
import type { SummaryCard as SummaryCardData } from '@/types/summary';

const baseCard: SummaryCardData = {
  metricName: 'cash_on_hand',
  displayName: 'Cash on Hand',
  value: 250000,
  unit: 'currency',
};

const cardWithPositiveDelta: SummaryCardData = {
  ...baseCard,
  delta: {
    absoluteDelta: 15000,
    percentDelta: 6.38,
    comparisonType: 'prior_period',
  },
};

const cardWithNegativeDelta: SummaryCardData = {
  ...baseCard,
  delta: {
    absoluteDelta: -2000,
    percentDelta: -0.8,
    comparisonType: 'prior_period',
  },
};

const cardWithZeroDelta: SummaryCardData = {
  ...baseCard,
  delta: {
    absoluteDelta: 0,
    percentDelta: 0,
    comparisonType: 'prior_period',
  },
};

const runwayCard: SummaryCardData = {
  metricName: 'runway_months',
  displayName: 'Runway',
  value: 14,
  unit: 'months',
};

describe('SummaryCard', () => {
  describe('given a card with a currency value', () => {
    it('renders the display name', () => {
      render(<SummaryCard card={baseCard} />);

      expect(screen.getByText('Cash on Hand')).toBeInTheDocument();
    });

    it('renders the formatted currency value', () => {
      render(<SummaryCard card={baseCard} />);

      expect(screen.getByTestId('summary-card-value')).toBeInTheDocument();
      expect(screen.getByTestId('summary-card-value').textContent).toContain('250');
    });
  });

  describe('given a card with a months unit', () => {
    it('renders the unit label as "months"', () => {
      render(<SummaryCard card={runwayCard} />);

      expect(screen.getByTestId('summary-card-unit')).toBeInTheDocument();
      expect(screen.getByTestId('summary-card-unit').textContent).toContain('months');
    });
  });

  describe('given a card with a positive delta', () => {
    it('renders an up-arrow indicator', () => {
      render(<SummaryCard card={cardWithPositiveDelta} />);

      expect(screen.getByTestId('delta-up')).toBeInTheDocument();
    });

    it('applies green color styling to the delta', () => {
      render(<SummaryCard card={cardWithPositiveDelta} />);

      const delta = screen.getByTestId('delta-up');
      expect(delta).toHaveClass('text-green-600');
    });

    it('renders the percent delta value', () => {
      render(<SummaryCard card={cardWithPositiveDelta} />);

      expect(screen.getByTestId('delta-percent')).toBeInTheDocument();
      expect(screen.getByTestId('delta-percent').textContent).toContain('6.38');
    });
  });

  describe('given a card with a negative delta', () => {
    it('renders a down-arrow indicator', () => {
      render(<SummaryCard card={cardWithNegativeDelta} />);

      expect(screen.getByTestId('delta-down')).toBeInTheDocument();
    });

    it('applies red color styling to the delta', () => {
      render(<SummaryCard card={cardWithNegativeDelta} />);

      const delta = screen.getByTestId('delta-down');
      expect(delta).toHaveClass('text-red-600');
    });

    it('renders the negative percent delta value', () => {
      render(<SummaryCard card={cardWithNegativeDelta} />);

      expect(screen.getByTestId('delta-percent').textContent).toContain('0.8');
    });
  });

  describe('given a card with zero delta', () => {
    it('does not render a directional arrow', () => {
      render(<SummaryCard card={cardWithZeroDelta} />);

      expect(screen.queryByTestId('delta-up')).not.toBeInTheDocument();
      expect(screen.queryByTestId('delta-down')).not.toBeInTheDocument();
    });
  });

  describe('given a card without a delta', () => {
    it('does not render any delta indicator', () => {
      render(<SummaryCard card={baseCard} />);

      expect(screen.queryByTestId('delta-up')).not.toBeInTheDocument();
      expect(screen.queryByTestId('delta-down')).not.toBeInTheDocument();
      expect(screen.queryByTestId('delta-percent')).not.toBeInTheDocument();
    });
  });

  describe('given a loading state', () => {
    it('renders a loading skeleton when isLoading is true', () => {
      render(<SummaryCard card={baseCard} isLoading={true} />);

      expect(screen.getByTestId('summary-card-loading')).toBeInTheDocument();
    });

    it('does not render value content while loading', () => {
      render(<SummaryCard card={baseCard} isLoading={true} />);

      expect(screen.queryByTestId('summary-card-value')).not.toBeInTheDocument();
    });
  });
});
