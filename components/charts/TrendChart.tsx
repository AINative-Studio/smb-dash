import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TrendSeries } from '@/types/trends';

interface TrendChartProps {
  series: TrendSeries[];
}

type ChartRow = Record<string, string | number>;

function buildChartData(series: TrendSeries[]): ChartRow[] {
  // Collect all unique period labels in insertion order across all series
  const labelOrder: string[] = [];
  const seen = new Set<string>();

  for (const s of series) {
    for (const dp of s.dataPoints) {
      if (!seen.has(dp.label)) {
        seen.add(dp.label);
        labelOrder.push(dp.label);
      }
    }
  }

  // Build one row per label
  return labelOrder.map((label) => {
    const row: ChartRow = { label };
    for (const s of series) {
      const point = s.dataPoints.find((dp) => dp.label === label);
      if (point !== undefined) {
        row[s.metricName] = point.value;
      }
    }
    return row;
  });
}

const LINE_COLORS = [
  '#2563eb',
  '#16a34a',
  '#dc2626',
  '#d97706',
  '#7c3aed',
  '#0891b2',
];

export function TrendChart({ series }: TrendChartProps) {
  const hasData =
    series.length > 0 && series.some((s) => s.dataPoints.length > 0);

  if (!hasData) {
    return (
      <div data-testid="trend-chart-empty">
        <p>No trend data available</p>
      </div>
    );
  }

  const chartData = buildChartData(series);

  return (
    <div data-testid="trend-chart">
      <ul aria-label="chart-legend">
        {series.map((s, index) => (
          <li
            key={s.metricName}
            style={{ color: LINE_COLORS[index % LINE_COLORS.length] }}
          >
            {s.displayName}
          </li>
        ))}
      </ul>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          {series.map((s, index) => (
            <Line
              key={s.metricName}
              type="monotone"
              dataKey={s.metricName}
              name={s.displayName}
              stroke={LINE_COLORS[index % LINE_COLORS.length]}
              dot={false}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
