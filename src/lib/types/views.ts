import type { ActiveFilters } from './dimensions';
import type { PredefinedPeriodKey } from './period';

export interface DashboardView {
  id: string;
  organization_id: string;
  user_id: string | null;
  name: string;
  is_default: boolean;
  layout_json: Record<string, unknown>;
  filters_json: SavedFilters;
  created_at: string;
  updated_at: string;
}

export interface SavedFilters {
  period_key: PredefinedPeriodKey;
  dimension_filters: ActiveFilters;
}

export interface CreateViewPayload {
  name: string;
  is_default: boolean;
  filters_json: SavedFilters;
  layout_json?: Record<string, unknown>;
}
