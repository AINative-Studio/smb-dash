import { getMetricByName } from '@/lib/kpi/metricUtils';

interface MetricLabelProps {
  metricName: string;
  className?: string;
}

export function MetricLabel({ metricName, className = '' }: MetricLabelProps) {
  const metric = getMetricByName(metricName);
  const displayName = metric?.display_name ?? metricName;
  const description = metric?.description;

  return (
    <span className={`text-sm text-gray-400 ${className}`} title={description}>
      {displayName}
    </span>
  );
}
