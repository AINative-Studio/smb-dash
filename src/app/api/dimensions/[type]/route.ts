import { NextRequest, NextResponse } from 'next/server';

const MOCK_DATA: Record<string, { id: string; name: string }[]> = {
  customers: [
    { id: 'cust-1', name: 'Acme Industries' }, { id: 'cust-2', name: 'GlobalTech' },
    { id: 'cust-3', name: 'SmartSolutions' }, { id: 'cust-4', name: 'DataDriven Co' },
  ],
  vendors: [
    { id: 'vend-1', name: 'CloudHost Pro' }, { id: 'vend-2', name: 'Office Supply Co' },
    { id: 'vend-3', name: 'Legal Partners LLP' }, { id: 'vend-4', name: 'Marketing Agency X' },
  ],
  categories: [
    { id: 'cat-1', name: 'Software Services' }, { id: 'cat-2', name: 'Consulting' },
    { id: 'cat-3', name: 'SaaS Subscriptions' }, { id: 'cat-4', name: 'Hardware Sales' },
  ],
  products: [
    { id: 'prod-1', name: 'Enterprise Plan' }, { id: 'prod-2', name: 'Pro Plan' },
    { id: 'prod-3', name: 'Starter Plan' }, { id: 'prod-4', name: 'Custom Integration' },
  ],
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const data = MOCK_DATA[type];
  if (!data) return NextResponse.json({ error: `Unknown dimension type: ${type}` }, { status: 400 });
  return NextResponse.json(data);
}
