export type MetricUnit = 'currency' | 'percent' | 'days' | 'months' | 'count';

export interface MetricDefinition {
  metricName: string;
  displayName: string;
  description?: string;
  metricUnit: MetricUnit;
  metricCategory: string;
}
