import type { MetricDefinition, MetricCategory } from '@/lib/types/metrics';
import { METRIC_DICTIONARY, EXECUTIVE_METRICS } from './metricDictionary';

export function getMetricByName(name: string): MetricDefinition | undefined {
  return METRIC_DICTIONARY.find(m => m.metric_name === name);
}

export function getMetricsByCategory(category: MetricCategory): MetricDefinition[] {
  return METRIC_DICTIONARY.filter(m => m.metric_category === category && m.is_active);
}

export function getMetricUnit(name: string): string {
  return getMetricByName(name)?.metric_unit ?? 'count';
}

export function getAllActiveMetrics(): MetricDefinition[] {
  return METRIC_DICTIONARY.filter(m => m.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export function getExecutiveMetrics(): MetricDefinition[] {
  return EXECUTIVE_METRICS
    .map(name => getMetricByName(name))
    .filter((m): m is MetricDefinition => m !== undefined);
}
