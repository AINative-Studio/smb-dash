'use client';

import { useEffect, useState } from 'react';
import { TrendChart } from '@/components/charts/TrendChart';
import { SummaryCard } from '@/components/kpi-cards/SummaryCard';
import type { TrendSeries } from '@/types/trends';
import type { SummaryCard as SummaryCardData } from '@/types/summary';

type LoadState = 'loading' | 'loaded' | 'error';

const ORG_ID = 'org-1';
const TREND_METRICS = 'net_cash_flow,cash_inflow,cash_outflow';
const SUMMARY_METRICS = 'cash_on_hand,runway_months';

export default function CashFlowPage() {
  const [trends, setTrends] = useState<TrendSeries[]>([]);
  const [cards, setCards] = useState<SummaryCardData[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  useEffect(() => {
    const trendsUrl = `/api/kpis/trends?organizationId=${ORG_ID}&metrics=${TREND_METRICS}&periodType=monthly`;
    const summaryUrl = `/api/kpis/summary?organizationId=${ORG_ID}&metrics=${SUMMARY_METRICS}&periodType=monthly&includeComparison=true`;

    Promise.all([
      fetch(trendsUrl).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      }),
      fetch(summaryUrl).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      }),
    ])
      .then(([trendsData, summaryData]) => {
        setTrends(trendsData.trends);
        setCards(summaryData.cards);
        setLoadState('loaded');
      })
      .catch(() => {
        setLoadState('error');
      });
  }, []);

  return (
    <div>
      <h1>Cash Flow</h1>

      {loadState === 'loading' && (
        <div data-testid="cashflow-loading">
          <p>Loading cash flow data...</p>
        </div>
      )}

      {loadState === 'error' && (
        <div data-testid="cashflow-error">
          <p>Failed to load cash flow data. Please try again.</p>
        </div>
      )}

      {loadState === 'loaded' && (
        <>
          <section data-testid="cashflow-trends-section">
            <h2>Cash Flow Over Time</h2>
            <TrendChart series={trends} />
          </section>

          <section data-testid="cashflow-summary-section">
            <h2>Key Metrics</h2>
            {cards.length === 0 ? (
              <div data-testid="cashflow-summary-empty">
                <p>No summary data available.</p>
              </div>
            ) : (
              <div>
                {cards.map((card) => (
                  <SummaryCard key={card.metricName} card={card} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
