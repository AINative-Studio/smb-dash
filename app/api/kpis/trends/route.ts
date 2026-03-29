import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/lib/zerodb/client';
import { fetchTrendSeries } from '@/lib/kpi/trends';
import type { TrendsApiResponse } from '@/types/trends';

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

  const metricNames = metricsParam.split(',').map((m) => m.trim()).filter(Boolean);
  const periodType = searchParams.get('periodType') ?? 'monthly';

  try {
    const client = getClient();
    const trends = await fetchTrendSeries(client, {
      organizationId,
      metricNames,
      periodType,
    });

    const body: TrendsApiResponse = {
      trends,
      periodType,
      organizationId,
    };

    return NextResponse.json(body, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
