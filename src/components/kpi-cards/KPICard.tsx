'use client';

import type { KPIMetric } from '@/lib/types/kpi';
import { MetricLabel } from './MetricLabel';
import { MetricValue } from './MetricValue';
import { DeltaBadge } from './DeltaBadge';
import { getMetricUnit } from '@/lib/kpi/metricUtils';

interface KPICardProps {
  metric: KPIMetric;
  onClick?: () => void;
}

export function KPICard({ metric, onClick }: KPICardProps) {
  const unit = getMetricUnit(metric.metric_name) ?? metric.metric_unit;

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-[#2D333B] bg-[#161B22] p-5 transition-all duration-200 hover:border-[#4B6FED]/50 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:shadow-[#4B6FED]/5' : ''
      }`}
    >
      <MetricLabel metricName={metric.metric_name} />
      <div className="mt-2">
        <MetricValue value={metric.metric_value} unit={unit} />
      </div>
      <div className="mt-2">
        <DeltaBadge delta={metric.delta_percent} metricName={metric.metric_name} />
      </div>
    </div>
  );
}
