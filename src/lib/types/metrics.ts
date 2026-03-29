export type MetricUnit = 'currency' | 'percent' | 'days' | 'months' | 'count' | 'ratio';
export type MetricCategory = 'revenue' | 'profitability' | 'cashflow' | 'ar' | 'ap' | 'expense' | 'customer';

export interface MetricDefinition {
  metric_name: string;
  display_name: string;
  description: string;
  metric_unit: MetricUnit;
  metric_category: MetricCategory;
  formula_text: string;
  is_active: boolean;
  sort_order: number;
}
