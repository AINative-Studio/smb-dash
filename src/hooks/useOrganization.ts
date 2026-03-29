'use client';

import { useOrganizationContext } from '@/lib/context/OrganizationContext';

export function useOrganization() {
  const { activeOrganization, organizations, setActiveOrganization, isLoading, error } = useOrganizationContext();
  return {
    organization: activeOrganization,
    organizationId: activeOrganization?.id ?? null,
    organizations,
    setOrganization: setActiveOrganization,
    isLoading,
    error,
  };
}
