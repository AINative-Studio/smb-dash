'use client';

import { useEffect, useState } from 'react';
import { SummaryCard } from '@/components/kpi-cards/SummaryCard';
import type { SummaryCard as SummaryCardData } from '@/types/summary';

type LoadState = 'loading' | 'loaded' | 'error';

const ORG_ID = 'org-1';
const SUMMARY_METRICS = 'ar_balance,ap_balance';

const AGING_LINKS: Record<string, string> = {
  ar_balance: '/ar-ap/ar-aging',
  ap_balance: '/ar-ap/ap-aging',
};

export default function ArApPage() {
  const [cards, setCards] = useState<SummaryCardData[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  useEffect(() => {
    const summaryUrl = `/api/kpis/summary?organizationId=${ORG_ID}&metrics=${SUMMARY_METRICS}&periodType=monthly&includeComparison=true`;

    fetch(summaryUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCards(data.cards);
        setLoadState('loaded');
      })
      .catch(() => {
        setLoadState('error');
      });
  }, []);

  return (
    <div>
      <h1>Accounts Receivable &amp; Payable</h1>

      {loadState === 'loading' && (
        <div data-testid="arap-loading">
          <p>Loading AR/AP data...</p>
        </div>
      )}

      {loadState === 'error' && (
        <div data-testid="arap-error">
          <p>Failed to load AR/AP data. Please try again.</p>
        </div>
      )}

      {loadState === 'loaded' && (
        <section data-testid="arap-summary-section">
          <h2>Balance Summary</h2>
          {cards.length === 0 ? (
            <div data-testid="arap-summary-empty">
              <p>No balance data available.</p>
            </div>
          ) : (
            <div>
              {cards.map((card) => {
                const href = AGING_LINKS[card.metricName] ?? '#';
                return (
                  <div key={card.metricName}>
                    <a href={href} aria-label={card.displayName}>
                      <SummaryCard card={card} />
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
