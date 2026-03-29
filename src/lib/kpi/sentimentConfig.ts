export const UP_IS_GOOD: string[] = [
  'total_revenue', 'gross_profit', 'net_profit', 'cash_on_hand',
  'net_cash_flow', 'runway_months', 'gross_margin_pct', 'net_margin_pct',
  'avg_invoice_value',
];

export const DOWN_IS_GOOD: string[] = [
  'total_expenses', 'burn_rate', 'dso', 'dpo', 'ap_balance',
  'operating_expense_ratio', 'overdue_invoice_amount',
];

export type Sentiment = 'good' | 'bad' | 'neutral';

export function getSentiment(metricName: string, delta: number | null): Sentiment {
  if (delta === null || delta === 0) return 'neutral';
  if (UP_IS_GOOD.includes(metricName)) return delta > 0 ? 'good' : 'bad';
  if (DOWN_IS_GOOD.includes(metricName)) return delta < 0 ? 'good' : 'bad';
  return 'neutral';
}
