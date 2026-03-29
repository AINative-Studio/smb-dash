'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DashboardView, CreateViewPayload } from '@/lib/types/views';

export function useSavedViews(orgId: string | null) {
  const [views, setViews] = useState<DashboardView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchViews = useCallback(async () => {
    if (!orgId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/views?organization_id=${orgId}`);
      if (!res.ok) throw new Error('Failed to fetch views');
      setViews(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => { fetchViews(); }, [fetchViews]);

  const saveView = useCallback(async (payload: CreateViewPayload) => {
    if (!orgId) return null;
    const res = await fetch(`/api/views?organization_id=${orgId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to save view');
    const newView = await res.json();
    await fetchViews();
    return newView as DashboardView;
  }, [orgId, fetchViews]);

  const defaultView = views.find(v => v.is_default) ?? null;

  return { views, defaultView, isLoading, error, saveView, refetch: fetchViews };
}
