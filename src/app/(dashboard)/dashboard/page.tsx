'use client';

import { KPICardGrid } from '@/components/kpi-cards/KPICardGrid';
import { KPICardSkeletonGrid } from '@/components/kpi-cards/KPICardSkeleton';
import { KPIEmptyState } from '@/components/kpi-cards/KPIEmptyState';
import { useKPISummary } from '@/hooks/useKPISummary';

const DEFAULT_ORG = 'org-001-acme';

export default function ExecutiveDashboard() {
  const { data, isLoading, error } = useKPISummary(DEFAULT_ORG, null);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Executive Dashboard</h1>

      {isLoading && <KPICardSkeletonGrid />}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {!isLoading && !error && data.length === 0 && (
        <KPIEmptyState message="No KPI data available yet" actionText="Connect QuickBooks to start syncing data" />
      )}
      {!isLoading && !error && data.length > 0 && (
        <KPICardGrid metrics={data} />
      )}
    </div>
  );
}
