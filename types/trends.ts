export interface TrendDataPoint {
  periodId: string;
  label: string;
  value: number;
  unit: string;
}

export interface TrendSeries {
  metricName: string;
  displayName: string;
  unit: string;
  dataPoints: TrendDataPoint[];
}

export interface TrendsApiResponse {
  trends: TrendSeries[];
  periodType: string;
  organizationId: string;
}

export interface TrendsApiRequest {
  organizationId: string;
  metricNames: string[];
  periodType: string;
  periodIds?: string[];
  seriesKey?: string | null;
}
