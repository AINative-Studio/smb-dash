'use client';

import { useState, useEffect } from 'react';

export function useBreakdowns(orgId: string | null, type: string, options?: { groupBy?: string; sortBy?: string; sortDir?: string; balanceType?: string }) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;
    setIsLoading(true);
    const params = new URLSearchParams({ organization_id: orgId, type });
    if (options?.groupBy) params.set('group_by', options.groupBy);
    if (options?.sortBy) params.set('sort_by', options.sortBy);
    if (options?.sortDir) params.set('sort_dir', options.sortDir);
    if (options?.balanceType) params.set('balance_type', options.balanceType);

    fetch(`/api/kpis/breakdowns?${params}`)
      .then(res => { if (!res.ok) throw new Error('Failed to fetch breakdowns'); return res.json(); })
      .then(result => setData(result.data ?? []))
      .catch(err => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setIsLoading(false));
  }, [orgId, type, options?.groupBy, options?.sortBy, options?.sortDir, options?.balanceType]);

  return { data, isLoading, error };
}
