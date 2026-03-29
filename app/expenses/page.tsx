'use client';

import { useEffect, useState } from 'react';
import { TrendChart } from '@/components/charts/TrendChart';
import { ExpenseBreakdownTable } from '@/components/tables/ExpenseBreakdownTable';
import type { TrendSeries } from '@/types/trends';
import type { ExpenseBreakdownRow, BreakdownApiResponse } from '@/types/breakdowns';

type LoadState = 'loading' | 'loaded' | 'error';
type BreakdownTab = 'category' | 'vendor';

export default function ExpensesPage() {
  const [trendSeries, setTrendSeries] = useState<TrendSeries[]>([]);
  const [trendLoadState, setTrendLoadState] = useState<LoadState>('loading');

  const [breakdownRows, setBreakdownRows] = useState<ExpenseBreakdownRow[]>([]);
  const [breakdownLoadState, setBreakdownLoadState] = useState<LoadState>('loading');
  const [activeTab, setActiveTab] = useState<BreakdownTab>('category');

  const orgId = 'org-1'; // Will come from auth context post-merge with #1-#10

  // Fetch expense trend on mount
  useEffect(() => {
    fetch(
      `/api/kpis/trends?organizationId=${orgId}&metrics=total_expenses&periodType=monthly`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setTrendSeries(data.trends);
        setTrendLoadState('loaded');
      })
      .catch(() => {
        setTrendLoadState('error');
      });
  }, []);

  // Fetch breakdown whenever the active tab changes
  useEffect(() => {
    setBreakdownLoadState('loading');
    setBreakdownRows([]);

    fetch(
      `/api/kpis/breakdowns/expenses?organizationId=${orgId}&groupBy=${activeTab}&periodType=monthly`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<BreakdownApiResponse<ExpenseBreakdownRow>>;
      })
      .then((data) => {
        setBreakdownRows(data.rows);
        setBreakdownLoadState('loaded');
      })
      .catch(() => {
        setBreakdownLoadState('error');
      });
  }, [activeTab]);

  const isInitialLoading =
    trendLoadState === 'loading' && breakdownLoadState === 'loading';

  return (
    <div>
      <h1>Expense Dashboard</h1>

      {isInitialLoading && (
        <div data-testid="expenses-loading">
          <p>Loading expense data...</p>
        </div>
      )}

      {/* Trend section */}
      {trendLoadState === 'error' && (
        <div data-testid="expense-trend-error">
          <p>Failed to load expense trend data. Please try again.</p>
        </div>
      )}

      {trendLoadState === 'loaded' && (
        <section data-testid="expense-trend-section">
          <h2>Expense Trend</h2>
          <TrendChart series={trendSeries} />
        </section>
      )}

      {/* Breakdown section */}
      {breakdownLoadState === 'error' && (
        <div data-testid="expense-breakdown-error">
          <p>Failed to load expense breakdown data. Please try again.</p>
        </div>
      )}

      {(breakdownLoadState === 'loaded' || breakdownLoadState === 'loading') &&
        trendLoadState !== 'loading' && (
          <section data-testid="expense-breakdown-section">
            <h2>Expense Breakdown</h2>

            <div role="group" aria-label="breakdown tabs">
              <button
                type="button"
                aria-pressed={activeTab === 'category'}
                onClick={() => setActiveTab('category')}
              >
                Category
              </button>
              <button
                type="button"
                aria-pressed={activeTab === 'vendor'}
                onClick={() => setActiveTab('vendor')}
              >
                Vendor
              </button>
            </div>

            {breakdownLoadState === 'loaded' && breakdownRows.length === 0 && (
              <div data-testid="expense-breakdown-empty">
                <p>No expense data available for this period.</p>
              </div>
            )}

            {breakdownLoadState === 'loaded' && breakdownRows.length > 0 && (
              <ExpenseBreakdownTable rows={breakdownRows} groupBy={activeTab} />
            )}
          </section>
        )}
    </div>
  );
}
