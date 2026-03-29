import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/lib/zerodb/client';
import { fetchSummaryCards } from '@/lib/kpi/summary';
import type { SummaryApiResponse } from '@/types/summary';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  const organizationId = searchParams.get('organizationId');
  const metricsParam = searchParams.get('metrics');

  if (!organizationId) {
    return NextResponse.json(
      { error: 'Missing required query parameter: organizationId' },
      { status: 400 }
    );
  }

  if (!metricsParam) {
    return NextResponse.json(
      { error: 'Missing required query parameter: metrics' },
      { status: 400 }
    );
  }

  const metricNames = metricsParam
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);
  const periodType = searchParams.get('periodType') ?? 'monthly';
  const includeComparison = searchParams.get('includeComparison') === 'true';

  try {
    const client = getClient();
    const cards = await fetchSummaryCards(client, {
      organizationId,
      metricNames,
      periodType,
      includeComparison,
    });

    const body: SummaryApiResponse = {
      cards,
      organizationId,
      periodType,
    };

    return NextResponse.json(body, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
