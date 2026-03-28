# KPI Dashboard Data Model

## Goal

This model is for the **analytics/dashboard layer only**, not raw QuickBooks sync, not AI memory, not alerts. It is designed to support:

* KPI summary cards
* trend charts
* period comparisons
* breakdowns by customer/vendor/category/product
* dashboard filters
* drilldown tables

---

# 1. Core Design Principle

Use a **fact + dimension model**:

* **Dimensions** = descriptive entities used for slicing/filtering
* **Facts** = measurable KPI and financial values

This keeps the dashboard fast, flexible, and clean.

---

# 2. Core Tables

## 2.1 organizations

```sql
organizations (
  id uuid primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)
```

---

## 2.2 dashboard_periods

Standardized time windows for reporting.

```sql
dashboard_periods (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  period_type text not null, -- daily, weekly, monthly, quarterly, yearly
  period_start date not null,
  period_end date not null,
  label text, -- "Mar 2026", "Q1 2026"
  is_closed boolean not null default false,
  created_at timestamptz not null default now()
)
```

**Purpose:**

* drives charts and comparisons
* ensures KPI snapshots map to consistent reporting periods

---

## 2.3 dimension_customers

```sql
dimension_customers (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  external_id text,
  customer_name text not null,
  customer_type text, -- smb, enterprise, retail, etc.
  industry text,
  region text,
  status text, -- active, inactive
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)
```

---

## 2.4 dimension_vendors

```sql
dimension_vendors (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  external_id text,
  vendor_name text not null,
  vendor_type text,
  category text,
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)
```

---

## 2.5 dimension_categories

Used for expense/revenue/account grouping.

```sql
dimension_categories (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  category_name text not null,
  category_type text not null, -- revenue, expense, cogs, asset, liability
  parent_category_id uuid references dimension_categories(id),
  sort_order integer,
  created_at timestamptz not null default now()
)
```

---

## 2.6 dimension_products

```sql
dimension_products (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  external_id text,
  product_name text not null,
  product_type text, -- service, inventory, subscription
  category_id uuid references dimension_categories(id),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)
```

---

## 2.7 dimension_accounts

Chart-of-accounts level dimension.

```sql
dimension_accounts (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  external_id text,
  account_name text not null,
  account_type text not null, -- income, expense, bank, ar, ap, cogs
  account_subtype text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)
```

---

# 3. Fact Tables

## 3.1 fact_financial_metrics

This is the **main aggregated dashboard fact table**.

```sql
fact_financial_metrics (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  period_id uuid not null references dashboard_periods(id),

  metric_name text not null, 
  -- examples:
  -- total_revenue
  -- gross_profit
  -- net_profit
  -- gross_margin_pct
  -- net_cash_flow
  -- cash_on_hand
  -- ar_balance
  -- ap_balance
  -- dso
  -- dpo
  -- burn_rate
  -- runway_months

  metric_value numeric not null,
  metric_unit text not null, -- currency, percent, days, months, count

  customer_id uuid null references dimension_customers(id),
  vendor_id uuid null references dimension_vendors(id),
  category_id uuid null references dimension_categories(id),
  product_id uuid null references dimension_products(id),
  account_id uuid null references dimension_accounts(id),

  currency_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)
```

### Why this matters

This powers:

* KPI cards
* trend lines
* segmented views
* filtered dashboards

### Example rows

* monthly total_revenue for March 2026
* monthly revenue for Customer A
* monthly expense for Legal category
* monthly AP balance
* monthly DSO

---

## 3.2 fact_kpi_comparisons

Precomputed comparisons for fast dashboard rendering.

```sql
fact_kpi_comparisons (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  metric_name text not null,
  current_period_id uuid not null references dashboard_periods(id),
  comparison_period_id uuid not null references dashboard_periods(id),

  current_value numeric not null,
  comparison_value numeric not null,
  absolute_delta numeric not null,
  percent_delta numeric null,

  comparison_type text not null, -- previous_period, previous_month, previous_year
  customer_id uuid null references dimension_customers(id),
  vendor_id uuid null references dimension_vendors(id),
  category_id uuid null references dimension_categories(id),
  product_id uuid null references dimension_products(id),

  created_at timestamptz not null default now()
)
```

**Purpose:**

* makes dashboard cards instant
* avoids recalculating deltas every time

---

## 3.3 fact_metric_trends

Optional optimization table for charting.

```sql
fact_metric_trends (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  metric_name text not null,
  period_id uuid not null references dashboard_periods(id),
  metric_value numeric not null,
  metric_unit text not null,

  series_key text, 
  -- null for overall trend
  -- or "customer:<uuid>", "category:<uuid>", etc.

  created_at timestamptz not null default now()
)
```

**Purpose:**

* optimized chart feeds
* especially useful if frontend requests lots of chart data

---

# 4. Drilldown Tables

## 4.1 fact_revenue_breakdown

```sql
fact_revenue_breakdown (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  period_id uuid not null references dashboard_periods(id),
  customer_id uuid null references dimension_customers(id),
  product_id uuid null references dimension_products(id),
  category_id uuid null references dimension_categories(id),

  revenue_amount numeric not null default 0,
  invoice_count integer not null default 0,
  avg_invoice_value numeric,
  payment_collected_amount numeric not null default 0,

  created_at timestamptz not null default now()
)
```

---

## 4.2 fact_expense_breakdown

```sql
fact_expense_breakdown (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  period_id uuid not null references dashboard_periods(id),
  vendor_id uuid null references dimension_vendors(id),
  category_id uuid null references dimension_categories(id),
  account_id uuid null references dimension_accounts(id),

  expense_amount numeric not null default 0,
  transaction_count integer not null default 0,
  avg_transaction_amount numeric,

  created_at timestamptz not null default now()
)
```

---

## 4.3 fact_ar_ap_breakdown

```sql
fact_ar_ap_breakdown (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  period_id uuid not null references dashboard_periods(id),

  balance_type text not null, -- ar, ap
  customer_id uuid null references dimension_customers(id),
  vendor_id uuid null references dimension_vendors(id),

  current_bucket numeric not null default 0,
  bucket_1_30 numeric not null default 0,
  bucket_31_60 numeric not null default 0,
  bucket_61_90 numeric not null default 0,
  bucket_90_plus numeric not null default 0,

  total_balance numeric not null default 0,
  overdue_balance numeric not null default 0,

  created_at timestamptz not null default now()
)
```

---

# 5. Dashboard Configuration Tables

## 5.1 dashboard_views

Stores saved dashboard states.

```sql
dashboard_views (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  user_id uuid,
  name text not null,
  is_default boolean not null default false,
  layout_json jsonb not null,
  filters_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)
```

---

## 5.2 dashboard_filters

Optional normalized table for reusable filters.

```sql
dashboard_filters (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  filter_name text not null,
  filter_type text not null, -- date_range, customer, vendor, category, product
  filter_config jsonb not null,
  created_at timestamptz not null default now()
)
```

---

# 6. KPI Metric Dictionary

## 6.1 metric_definitions

This is important. It prevents dashboard chaos.

```sql
metric_definitions (
  id uuid primary key,
  metric_name text unique not null,
  display_name text not null,
  description text,
  metric_unit text not null,
  metric_category text not null, -- revenue, profitability, cashflow, ar, ap, customer, expense
  formula_text text,
  is_active boolean not null default true,
  sort_order integer,
  created_at timestamptz not null default now()
)
```

### Example metrics

* total_revenue
* revenue_growth_pct
* gross_profit
* gross_margin_pct
* net_profit
* net_margin_pct
* cash_on_hand
* net_cash_flow
* burn_rate
* runway_months
* ar_balance
* dso
* ap_balance
* dpo
* overdue_invoice_amount
* top_customer_concentration_pct
* avg_invoice_value
* total_expenses
* operating_expense_ratio

---

# 7. Recommended Minimal MVP Model

If you want the leanest possible KPI dashboard model, use only these:

* `organizations`
* `dashboard_periods`
* `dimension_customers`
* `dimension_vendors`
* `dimension_categories`
* `dimension_products`
* `dimension_accounts`
* `metric_definitions`
* `fact_financial_metrics`
* `fact_kpi_comparisons`
* `fact_revenue_breakdown`
* `fact_expense_breakdown`
* `fact_ar_ap_breakdown`

That is enough for:

* summary cards
* trends
* comparisons
* drilldowns
* filters
* saved views

---

# 8. Simplified ERD Shape

```txt
organizations
  ├── dashboard_periods
  ├── dimension_customers
  ├── dimension_vendors
  ├── dimension_categories
  ├── dimension_products
  ├── dimension_accounts
  ├── dashboard_views
  ├── dashboard_filters
  ├── fact_financial_metrics
  ├── fact_kpi_comparisons
  ├── fact_revenue_breakdown
  ├── fact_expense_breakdown
  └── fact_ar_ap_breakdown
```

---

# 9. Best Practice for Dashboard Speed

For the KPI dashboard, do **not** calculate everything live from transactional data.

Instead:

* sync raw accounting data elsewhere
* compute aggregates into `fact_*` tables
* read the dashboard only from these fact tables

That gives you:

* faster charts
* predictable API performance
* simpler frontend queries
* easier caching

---

# 10. Example API Response Shape

This model supports a frontend payload like:

```json
{
  "summary_cards": [
    { "metric": "total_revenue", "value": 125000, "unit": "currency", "delta_percent": 12.4 },
    { "metric": "net_profit", "value": 22000, "unit": "currency", "delta_percent": -8.1 },
    { "metric": "cash_on_hand", "value": 180000, "unit": "currency", "delta_percent": 3.2 },
    { "metric": "dso", "value": 34, "unit": "days", "delta_percent": 9.7 }
  ],
  "trends": [
    { "metric": "total_revenue", "points": [...] },
    { "metric": "net_profit", "points": [...] }
  ],
  "breakdowns": {
    "revenue_by_customer": [...],
    "expenses_by_category": [...],
    "ar_aging": [...]
  }
}
```

---

