import { NextRequest, NextResponse } from 'next/server';

const MOCK_ORGS: Record<string, { id: string; name: string; created_at: string; updated_at: string }> = {
  'org-001-acme': { id: 'org-001-acme', name: 'Acme Corp', created_at: '2025-01-15T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
  'org-002-tech': { id: 'org-002-tech', name: 'TechStart Inc', created_at: '2025-06-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const org = MOCK_ORGS[orgId];
  if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  return NextResponse.json(org);
}
