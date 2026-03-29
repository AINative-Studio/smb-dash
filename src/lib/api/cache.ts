interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs: number = 300_000): void {
  cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
}

export function invalidateCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(pattern)) cache.delete(key);
  }
}

export function buildCacheKey(endpoint: string, params: Record<string, string | undefined>): string {
  const sorted = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return `${endpoint}?${sorted}`;
}

export const CACHE_TTL = {
  KPI_SUMMARY: 5 * 60 * 1000,
  TRENDS: 5 * 60 * 1000,
  BREAKDOWNS: 5 * 60 * 1000,
  PERIODS: 15 * 60 * 1000,
  DIMENSIONS: 10 * 60 * 1000,
  METRIC_DEFINITIONS: 60 * 60 * 1000,
} as const;
