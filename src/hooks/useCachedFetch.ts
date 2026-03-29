'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getCached, setCache, buildCacheKey } from '@/lib/api/cache';

interface UseCachedFetchOptions {
  ttl?: number;
  enabled?: boolean;
}

interface UseCachedFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCachedFetch<T>(
  endpoint: string,
  params: Record<string, string | undefined>,
  options: UseCachedFetchOptions = {}
): UseCachedFetchResult<T> {
  const { ttl = 300_000, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cacheKey = buildCacheKey(endpoint, params);

  const fetchData = useCallback(async () => {
    if (!enabled) { setIsLoading(false); return; }

    const cached = getCached<T>(cacheKey);
    if (cached) {
      setData(cached);
      setIsLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const queryString = Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v!)}`)
        .join('&');

      const res = await fetch(`${endpoint}?${queryString}`, { signal: controller.signal });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json = await res.json();
      setCache(cacheKey, json, ttl);
      setData(json);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, cacheKey, ttl, enabled]);

  useEffect(() => {
    fetchData();
    return () => { abortRef.current?.abort(); };
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
