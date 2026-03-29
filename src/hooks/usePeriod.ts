'use client';

import { usePeriodContext } from '@/lib/context/PeriodContext';
import type { PredefinedPeriodKey } from '@/lib/types/period';
import { getPeriodRange } from '@/lib/utils/period';

export function usePeriod() {
  const { selectedPeriod, selectedKey, isLoading, error, setSelectedKey } = usePeriodContext();
  const periodRange = getPeriodRange(selectedKey);
  const isPeriodSelected = (key: PredefinedPeriodKey) => key === selectedKey;
  return { selectedPeriod, selectedKey, periodRange, isLoading, error, setSelectedKey, isPeriodSelected };
}
