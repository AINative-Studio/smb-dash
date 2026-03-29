import { NextResponse } from 'next/server';
import { getAllActiveMetrics } from '@/lib/kpi/metricUtils';

export async function GET() {
  return NextResponse.json(getAllActiveMetrics());
}
