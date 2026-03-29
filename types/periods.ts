export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface DashboardPeriod {
  id: string;
  organizationId: string;
  periodType: PeriodType;
  periodStart: string;
  periodEnd: string;
  label: string;
  isClosed: boolean;
}
