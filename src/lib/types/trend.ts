export interface TrendPoint {
  period_id: string;
  period_label: string;
  period_start: string;
  metric_value: number;
}

export interface TrendSeries {
  metric_name: string;
  metric_unit: string;
  points: TrendPoint[];
  series_key: string | null;
}

export interface TrendResponse {
  series: TrendSeries[];
  organization_id: string;
}
