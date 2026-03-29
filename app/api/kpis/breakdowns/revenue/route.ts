import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/lib/zerodb/client';
import { fetchRevenueBreakdown } from '@/lib/kpi/breakdowns';
import type { BreakdownApiResponse, BreakdownGroupBy, RevenueBreakdownRow } from '@/types/breakdowns';

const VALID_GROUP_BY: BreakdownGroupBy[] = ['customer', 'vendor', 'category', 'product', 'account'];

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  const organizationId = searchParams.get('organizationId');
  const groupByParam = searchParams.get('groupBy');

  if (!organizationId) {
    return NextResponse.json(
      { error: 'Missing required query parameter: organizationId' },
      { status: 400 }
    );
  }

  if (!groupByParam) {
    return NextResponse.json(
      { error: 'Missing required query parameter: groupBy' },
      { status: 400 }
    );
  }

  if (!VALID_GROUP_BY.includes(groupByParam as BreakdownGroupBy)) {
    return NextResponse.json(
      { error: `Invalid groupBy value: "${groupByParam}". Must be one of: ${VALID_GROUP_BY.join(', ')}` },
      { status: 400 }
    );
  }

  const groupBy = groupByParam as BreakdownGroupBy;
  const periodType = searchParams.get('periodType') ?? 'monthly';
  const periodId = searchParams.get('periodId') ?? undefined;
  const sortBy = searchParams.get('sortBy') ?? undefined;
  const sortOrderParam = searchParams.get('sortOrder');
  const sortOrder = sortOrderParam === 'asc' ? 'asc' : sortOrderParam === 'desc' ? 'desc' : undefined;
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  try {
    const client = getClient();
    const rows = await fetchRevenueBreakdown(client, {
      organizationId,
      groupBy,
      periodType,
      periodId,
      sortBy,
      sortOrder,
      limit,
    });

    const body: BreakdownApiResponse<RevenueBreakdownRow> = {
      rows,
      groupBy,
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
