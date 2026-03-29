export interface SummaryCard {
  metricName: string;
  displayName: string;
  value: number;
  unit: string;
  delta?: {
    absoluteDelta: number;
    percentDelta: number | null;
    comparisonType: string;
  };
}

export interface SummaryApiResponse {
  cards: SummaryCard[];
  organizationId: string;
  periodType: string;
}

export interface SummaryApiRequest {
  organizationId: string;
  metricNames: string[];
  periodType?: string;
  includeComparison?: boolean;
}
