'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ActiveFilters, DimensionType } from '@/lib/types/dimensions';

interface FilterContextValue {
  activeFilters: ActiveFilters;
  setFilter: (type: DimensionType, id: string) => void;
  clearFilter: (type: DimensionType) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
}

const EMPTY_FILTERS: ActiveFilters = {
  customer_id: null,
  vendor_id: null,
  category_id: null,
  product_id: null,
};

const DIMENSION_TO_FILTER: Record<DimensionType, keyof ActiveFilters> = {
  customers: 'customer_id',
  vendors: 'vendor_id',
  categories: 'category_id',
  products: 'product_id',
};

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({ ...EMPTY_FILTERS });

  const setFilter = useCallback((type: DimensionType, id: string) => {
    setActiveFilters(prev => ({ ...prev, [DIMENSION_TO_FILTER[type]]: id }));
  }, []);

  const clearFilter = useCallback((type: DimensionType) => {
    setActiveFilters(prev => ({ ...prev, [DIMENSION_TO_FILTER[type]]: null }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({ ...EMPTY_FILTERS });
  }, []);

  const hasActiveFilters = useMemo(() =>
    Object.values(activeFilters).some(v => v !== null),
    [activeFilters]
  );

  const value = useMemo<FilterContextValue>(() => ({
    activeFilters, setFilter, clearFilter, clearAllFilters, hasActiveFilters,
  }), [activeFilters, setFilter, clearFilter, clearAllFilters, hasActiveFilters]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilterContext(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilterContext must be used within FilterProvider');
  return ctx;
}
