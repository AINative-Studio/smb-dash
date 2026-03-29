'use client';

import { useState, useEffect } from 'react';
import type { MetricDefinition } from '@/lib/types/metrics';

export function useMetricDefinitions() {
  const [definitions, setDefinitions] = useState<MetricDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/metrics/definitions')
      .then(res => { if (!res.ok) throw new Error('Failed to fetch metrics'); return res.json(); })
      .then(setDefinitions)
      .catch(err => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setIsLoading(false));
  }, []);

  return { definitions, isLoading, error };
}
