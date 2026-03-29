import { NextRequest, NextResponse } from 'next/server';
import type { DashboardView, CreateViewPayload } from '@/lib/types/views';

let MOCK_VIEWS: DashboardView[] = [
  {
    id: 'view-1',
    organization_id: 'org-001-acme',
    user_id: '1',
    name: 'Monthly Executive',
    is_default: true,
    layout_json: {},
    filters_json: {
      period_key: 'current_month',
      dimension_filters: { customer_id: null, vendor_id: null, category_id: null, product_id: null },
    },
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  const orgId = new URL(request.url).searchParams.get('organization_id');
  if (!orgId) return NextResponse.json({ error: 'organization_id is required' }, { status: 400 });
  return NextResponse.json(MOCK_VIEWS.filter(v => v.organization_id === orgId));
}

export async function POST(request: NextRequest) {
  const orgId = new URL(request.url).searchParams.get('organization_id');
  if (!orgId) return NextResponse.json({ error: 'organization_id is required' }, { status: 400 });

  const body: CreateViewPayload = await request.json();
  if (!body.name) return NextResponse.json({ error: 'name is required' }, { status: 400 });

  if (body.is_default) {
    MOCK_VIEWS = MOCK_VIEWS.map(v => v.organization_id === orgId ? { ...v, is_default: false } : v);
  }

  const newView: DashboardView = {
    id: `view-${Date.now()}`,
    organization_id: orgId,
    user_id: '1',
    name: body.name,
    is_default: body.is_default,
    layout_json: body.layout_json ?? {},
    filters_json: body.filters_json,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  MOCK_VIEWS.push(newView);
  return NextResponse.json(newView, { status: 201 });
}
