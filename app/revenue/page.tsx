'use client';

import { useEffect, useState } from 'react';
import { TrendChart } from '@/components/charts/TrendChart';
import { BreakdownTable } from '@/components/tables/BreakdownTable';
import type { TrendSeries } from '@/types/trends';
import type { RevenueBreakdownRow } from '@/types/breakdowns';

type LoadState = 'loading' | 'loaded' | 'error';

function computeGrowthPercent(series: TrendSeries | undefined): number | null {
  if (!series || series.dataPoints.length < 2) return null;
  const points = series.dataPoints;
  const prior = points[points.length - 2].value;
  const current = points[points.length - 1].value;
  if (prior === 0) return null;
  return ((current - prior) / prior) * 100;
}

export default function RevenuePage() {
  const [trends, setTrends] = useState<TrendSeries[]>([]);
  const [customerRows, setCustomerRows] = useState<RevenueBreakdownRow[]>([]);
  const [productRows, setProductRows] = useState<RevenueBreakdownRow[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  useEffect(() => {
    const orgId = 'org-1';

    const trendFetch = fetch(
      `/api/kpis/trends?organizationId=${orgId}&metrics=total_revenue&periodType=monthly`
    );
    const customerBreakdownFetch = fetch(
      `/api/kpis/breakdowns/revenue?organizationId=${orgId}&groupBy=customer&periodType=monthly`
    );
    const productBreakdownFetch = fetch(
      `/api/kpis/breakdowns/revenue?organizationId=${orgId}&groupBy=product&periodType=monthly`
    );

    Promise.all([trendFetch, customerBreakdownFetch, productBreakdownFetch])
      .then(async ([trendRes, customerRes, productRes]) => {
        if (!trendRes.ok) throw new Error(`Trends HTTP ${trendRes.status}`);

        const trendData = await trendRes.json();
        setTrends(trendData.trends);

        const customerData = customerRes.ok ? await customerRes.json() : { rows: [] };
        setCustomerRows(customerData.rows);

        const productData = productRes.ok ? await productRes.json() : { rows: [] };
        setProductRows(productData.rows);

        setLoadState('loaded');
      })
      .catch(() => {
        setLoadState('error');
      });
  }, []);

  if (loadState === 'loading') {
    return (
      <div data-testid="revenue-loading">
        <p>Loading revenue data...</p>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div data-testid="revenue-error">
        <p>Failed to load revenue data. Please try again.</p>
      </div>
    );
  }

  const revenueSeries = trends.find((s) => s.metricName === 'total_revenue');
  const growthPercent = computeGrowthPercent(revenueSeries);

  return (
    <div>
      <h1>Revenue Dashboard</h1>

      <section data-testid="revenue-trend-section">
        <h2>Revenue Trend</h2>
        {growthPercent !== null && (
          <span data-testid="revenue-growth-badge">
            {growthPercent >= 0 ? '+' : ''}
            {growthPercent.toFixed(1)}% vs prior period
          </span>
        )}
        <TrendChart series={trends} />
      </section>

      <section data-testid="customer-breakdown-section">
        <h2>Revenue by Customer</h2>
        <BreakdownTable rows={customerRows} groupBy="customer" />
      </section>

      <section data-testid="product-breakdown-section">
        <h2>Revenue by Product</h2>
        <BreakdownTable rows={productRows} groupBy="product" />
      </section>
    </div>
  );
}
