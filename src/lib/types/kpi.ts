export interface KPIMetric {
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  period_id: string;
  delta_percent: number | null;
  delta_absolute: number | null;
  comparison_type: string | null;
}

export interface KPISummaryResponse {
  metrics: KPIMetric[];
  period_label: string;
  organization_id: string;
}
