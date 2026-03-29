import { NextResponse } from 'next/server';
import type { Organization } from '@/lib/types/organization';

const MOCK_ORGS: Organization[] = [
  { id: 'org-001-acme', name: 'Acme Corp', created_at: '2025-01-15T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
  { id: 'org-002-tech', name: 'TechStart Inc', created_at: '2025-06-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
];

export async function GET() {
  return NextResponse.json(MOCK_ORGS);
}
