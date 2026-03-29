export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type PredefinedPeriodKey =
  | 'current_month'
  | 'last_month'
  | 'current_quarter'
  | 'last_quarter'
  | 'year_to_date'
  | 'last_12_months';

export interface DashboardPeriod {
  id: string;
  organization_id: string;
  period_type: PeriodType;
  period_start: string;
  period_end: string;
  label: string;
  is_closed: boolean;
  created_at: string;
}

export interface PeriodRange {
  period_start: string;
  period_end: string;
  period_type: PeriodType;
  label: string;
}

export interface PredefinedPeriodOption {
  key: PredefinedPeriodKey;
  label: string;
  period_type: PeriodType;
}
