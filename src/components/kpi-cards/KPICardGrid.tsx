import type { KPIMetric } from '@/lib/types/kpi';
import { KPICard } from './KPICard';

interface KPICardGridProps {
  metrics: KPIMetric[];
  onCardClick?: (metricName: string) => void;
}

export function KPICardGrid({ metrics, onCardClick }: KPICardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map(metric => (
        <KPICard
          key={metric.metric_name}
          metric={metric}
          onClick={onCardClick ? () => onCardClick(metric.metric_name) : undefined}
        />
      ))}
    </div>
  );
}
