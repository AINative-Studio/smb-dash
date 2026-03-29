import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/lib/zerodb/client';
import { fetchExpenseBreakdown } from '@/lib/kpi/expense-breakdowns';
import type { BreakdownApiResponse, BreakdownGroupBy } from '@/types/breakdowns';
import type { ExpenseBreakdownRow } from '@/types/breakdowns';

const VALID_GROUP_BY: BreakdownGroupBy[] = ['category', 'vendor'];

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
      { error: `Invalid groupBy value. Allowed values: ${VALID_GROUP_BY.join(', ')}` },
      { status: 400 }
    );
  }

  const groupBy = groupByParam as BreakdownGroupBy;
  const periodType = searchParams.get('periodType') ?? 'monthly';
  const sortBy = searchParams.get('sortBy') ?? undefined;
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc' | null) ?? undefined;

  try {
    const client = getClient();
    const rows = await fetchExpenseBreakdown(client, {
      organizationId,
      groupBy,
      periodType,
      sortBy,
      sortOrder,
    });

    const body: BreakdownApiResponse<ExpenseBreakdownRow> = {
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
