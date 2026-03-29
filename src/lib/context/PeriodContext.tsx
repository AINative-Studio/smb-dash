'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { DashboardPeriod, PredefinedPeriodKey } from '@/lib/types/period';
import { getPeriodRange, matchPeriod } from '@/lib/utils/period';

interface PeriodContextValue {
  selectedPeriod: DashboardPeriod | null;
  selectedKey: PredefinedPeriodKey;
  availablePeriods: DashboardPeriod[];
  isLoading: boolean;
  error: string | null;
  setSelectedKey: (key: PredefinedPeriodKey) => void;
}

const PeriodContext = createContext<PeriodContextValue | null>(null);

interface PeriodProviderProps {
  children: React.ReactNode;
  organizationId: string;
  defaultKey?: PredefinedPeriodKey;
}

export function PeriodProvider({ children, organizationId, defaultKey = 'current_month' }: PeriodProviderProps) {
  const [availablePeriods, setAvailablePeriods] = useState<DashboardPeriod[]>([]);
  const [selectedKey, setSelectedKey] = useState<PredefinedPeriodKey>(defaultKey);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organizationId) return;
    setIsLoading(true);
    fetch(`/api/periods?organization_id=${encodeURIComponent(organizationId)}`)
      .then(res => { if (!res.ok) throw new Error('Failed to fetch periods'); return res.json(); })
      .then((data: DashboardPeriod[]) => setAvailablePeriods(data))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load periods'))
      .finally(() => setIsLoading(false));
  }, [organizationId]);

  const selectedPeriod = useMemo(() => {
    if (availablePeriods.length === 0) return null;
    return matchPeriod(availablePeriods, getPeriodRange(selectedKey));
  }, [availablePeriods, selectedKey]);

  const handleSetKey = useCallback((key: PredefinedPeriodKey) => setSelectedKey(key), []);

  const value = useMemo<PeriodContextValue>(() => ({
    selectedPeriod, selectedKey, availablePeriods, isLoading, error, setSelectedKey: handleSetKey,
  }), [selectedPeriod, selectedKey, availablePeriods, isLoading, error, handleSetKey]);

  return <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>;
}

export function usePeriodContext(): PeriodContextValue {
  const ctx = useContext(PeriodContext);
  if (!ctx) throw new Error('usePeriodContext must be used within PeriodProvider');
  return ctx;
}
