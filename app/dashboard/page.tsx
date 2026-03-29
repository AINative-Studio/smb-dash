'use client';

import { useEffect, useState } from 'react';
import { TrendChart } from '@/components/charts/TrendChart';
import type { TrendSeries } from '@/types/trends';

type LoadState = 'loading' | 'loaded' | 'error';

export default function DashboardPage() {
  const [trends, setTrends] = useState<TrendSeries[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  useEffect(() => {
    const orgId = 'org-1'; // Will come from auth context post-merge with #1-#10
    const metrics = 'total_revenue,net_profit';

    fetch(`/api/kpis/trends?organizationId=${orgId}&metrics=${metrics}&periodType=monthly`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setTrends(data.trends);
        setLoadState('loaded');
      })
      .catch(() => {
        setLoadState('error');
      });
  }, []);

  return (
    <div>
      <h1>Executive Dashboard</h1>

      {loadState === 'loading' && (
        <div data-testid="trends-loading">
          <p>Loading trends...</p>
        </div>
      )}

      {loadState === 'error' && (
        <div data-testid="trends-error">
          <p>Failed to load trend data. Please try again.</p>
        </div>
      )}

      {loadState === 'loaded' && (
        <section data-testid="executive-trends-section">
          <h2>Financial Trends</h2>
          <TrendChart series={trends} />
        </section>
      )}
    </div>
  );
}
