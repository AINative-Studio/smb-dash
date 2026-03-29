export type ComparisonType = 'previous_period' | 'previous_month' | 'previous_year';

export interface KPIComparison {
  id: string;
  organization_id: string;
  metric_name: string;
  current_period_id: string;
  comparison_period_id: string;
  current_value: number;
  comparison_value: number;
  absolute_delta: number;
  percent_delta: number | null;
  comparison_type: ComparisonType;
  customer_id?: string | null;
  vendor_id?: string | null;
  category_id?: string | null;
  product_id?: string | null;
  created_at: string;
}

export interface DeltaResult {
  absolute: number;
  percent: number | null;
}
