'use client';

import { useRouter } from 'next/navigation';

const METRIC_ROUTE_MAP: Record<string, string> = {
  total_revenue: '/revenue',
  revenue_growth_pct: '/revenue',
  avg_invoice_value: '/revenue',
  gross_profit: '/revenue',
  net_profit: '/revenue',
  total_expenses: '/expenses',
  operating_expense_ratio: '/expenses',
  burn_rate: '/cashflow',
  cash_on_hand: '/cashflow',
  net_cash_flow: '/cashflow',
  runway_months: '/cashflow',
  ar_balance: '/ar-ap?tab=ar',
  dso: '/ar-ap?tab=ar',
  overdue_invoice_amount: '/ar-ap?tab=ar',
  ap_balance: '/ar-ap?tab=ap',
  dpo: '/ar-ap?tab=ap',
};

interface DrilldownLinkProps {
  metricName: string;
  children: React.ReactNode;
  className?: string;
}

export function DrilldownLink({ metricName, children, className = '' }: DrilldownLinkProps) {
  const router = useRouter();
  const route = METRIC_ROUTE_MAP[metricName];

  if (!route) return <>{children}</>;

  return (
    <button
      onClick={() => router.push(route)}
      className={`text-left w-full ${className}`}
      title={`View ${metricName} details`}
    >
      {children}
    </button>
  );
}

export function getMetricRoute(metricName: string): string | null {
  return METRIC_ROUTE_MAP[metricName] ?? null;
}
