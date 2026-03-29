export interface DimensionCustomer {
  id: string;
  organization_id: string;
  external_id: string | null;
  customer_name: string;
  customer_type: string | null;
  industry: string | null;
  region: string | null;
  status: 'active' | 'inactive';
}

export interface DimensionVendor {
  id: string;
  organization_id: string;
  external_id: string | null;
  vendor_name: string;
  vendor_type: string | null;
  category: string | null;
  status: 'active' | 'inactive';
}

export interface DimensionCategory {
  id: string;
  organization_id: string;
  category_name: string;
  category_type: 'revenue' | 'expense' | 'cogs' | 'asset' | 'liability';
  parent_category_id: string | null;
  sort_order: number | null;
}

export interface DimensionProduct {
  id: string;
  organization_id: string;
  external_id: string | null;
  product_name: string;
  product_type: 'service' | 'inventory' | 'subscription' | null;
  category_id: string | null;
  active: boolean;
}

export interface DimensionAccount {
  id: string;
  organization_id: string;
  external_id: string | null;
  account_name: string;
  account_type: 'income' | 'expense' | 'bank' | 'ar' | 'ap' | 'cogs';
  account_subtype: string | null;
  active: boolean;
}

export type DimensionType = 'customers' | 'vendors' | 'categories' | 'products';

export interface ActiveFilters {
  customer_id: string | null;
  vendor_id: string | null;
  category_id: string | null;
  product_id: string | null;
}
