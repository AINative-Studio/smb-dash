'use client';

import { useState, useEffect } from 'react';
import type { TrendSeries } from '@/lib/types/trend';

export function useTrends(orgId: string | null, metrics: string[]) {
  const [series, setSeries] = useState<TrendSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId || metrics.length === 0) return;
    setIsLoading(true);
    const params = new URLSearchParams({ organization_id: orgId, metrics: metrics.join(',') });

    fetch(`/api/kpis/trends?${params}`)
      .then(res => { if (!res.ok) throw new Error('Failed to fetch trends'); return res.json(); })
      .then(result => setSeries(result.series ?? []))
      .catch(err => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setIsLoading(false));
  }, [orgId, metrics.join(',')]);

  return { series, isLoading, error };
}
