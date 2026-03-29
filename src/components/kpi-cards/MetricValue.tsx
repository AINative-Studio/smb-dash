import { formatMetricValue } from '@/lib/formatters';

interface MetricValueProps {
  value: number;
  unit: string;
  className?: string;
}

export function MetricValue({ value, unit, className = '' }: MetricValueProps) {
  return (
    <span className={`text-2xl font-bold tabular-nums text-white ${className}`}>
      {formatMetricValue(value, unit)}
    </span>
  );
}
