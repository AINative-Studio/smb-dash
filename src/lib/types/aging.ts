export type BalanceType = 'ar' | 'ap';

export interface AgingBucket {
  current_bucket: number;
  bucket_1_30: number;
  bucket_31_60: number;
  bucket_61_90: number;
  bucket_90_plus: number;
  total_balance: number;
  overdue_balance: number;
}

export interface AgingBreakdownRow extends AgingBucket {
  id: string;
  organization_id: string;
  period_id: string;
  balance_type: BalanceType;
  customer_id: string | null;
  customer_name: string | null;
  vendor_id: string | null;
  vendor_name: string | null;
}

export interface AgingBucketLabel {
  key: keyof AgingBucket;
  label: string;
  isOverdue: boolean;
}

export const AGING_BUCKET_LABELS: AgingBucketLabel[] = [
  { key: 'current_bucket', label: 'Current', isOverdue: false },
  { key: 'bucket_1_30', label: '1-30 Days', isOverdue: true },
  { key: 'bucket_31_60', label: '31-60 Days', isOverdue: true },
  { key: 'bucket_61_90', label: '61-90 Days', isOverdue: true },
  { key: 'bucket_90_plus', label: '90+ Days', isOverdue: true },
];
