'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Organization } from '@/lib/types/organization';

interface OrganizationContextValue {
  organizations: Organization[];
  activeOrganization: Organization | null;
  setActiveOrganization: (org: Organization) => void;
  isLoading: boolean;
  error: string | null;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrganization, setActiveOrgState] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/organizations')
      .then(res => { if (!res.ok) throw new Error('Failed to fetch organizations'); return res.json(); })
      .then((data: Organization[]) => {
        setOrganizations(data);
        if (data.length > 0) setActiveOrgState(data[0]);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setIsLoading(false));
  }, []);

  const setActiveOrganization = useCallback((org: Organization) => {
    setActiveOrgState(org);
  }, []);

  const value = useMemo<OrganizationContextValue>(() => ({
    organizations, activeOrganization, setActiveOrganization, isLoading, error,
  }), [organizations, activeOrganization, setActiveOrganization, isLoading, error]);

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

export function useOrganizationContext(): OrganizationContextValue {
  const ctx = useContext(OrganizationContext);
  if (!ctx) throw new Error('useOrganizationContext must be used within OrganizationProvider');
  return ctx;
}
