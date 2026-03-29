'use client';

import { useState, useEffect } from 'react';
import type { KPIMetric } from '@/lib/types/kpi';

export function useKPISummary(organizationId: string | null, periodId: string | null) {
  const [data, setData] = useState<KPIMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organizationId) return;
    setIsLoading(true);
    const params = new URLSearchParams({ organization_id: organizationId });
    if (periodId) params.set('period_id', periodId);

    fetch(`/api/kpis/summary?${params}`)
      .then(res => { if (!res.ok) throw new Error('Failed to fetch KPI summary'); return res.json(); })
      .then((data) => setData(data.metrics ?? data))
      .catch(err => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setIsLoading(false));
  }, [organizationId, periodId]);

  return { data, isLoading, error };
}
