'use client';

import { useFilterContext } from '@/lib/context/FilterContext';

export function useFilters() {
  const { activeFilters, setFilter, clearFilter, clearAllFilters, hasActiveFilters } = useFilterContext();
  return { activeFilters, setFilter, clearFilter, clearAllFilters, hasActiveFilters };
}
