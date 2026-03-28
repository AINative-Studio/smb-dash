# 📊 PRD: AINative KPI Dashboard (MVP-Aligned)

*(Revised + aligned to data model + backlog)*
Source: 

---

# 1. Product Overview

The **AINative KPI Dashboard** is a **financial analytics layer on top of QuickBooks**, designed to transform accounting data into:

* precomputed KPIs
* trend analysis
* drilldowns and breakdowns
* (Phase 2+) AI insights and financial memory

The system uses:

* **QuickBooks → source of truth (raw data)**
* **ZeroDB → KPI + analytics storage (fact tables)**
* **Next.js → dashboard UI + API layer**

👉 Key principle:

> The dashboard reads only from **precomputed KPI fact tables**, not raw accounting data.

---

# 2. Problem

QuickBooks provides **transactions**, not **understanding**.

SMBs struggle to:

* convert raw data into KPIs
* identify trends and changes quickly
* understand *why* numbers changed
* drill into revenue, expenses, AR/AP efficiently

---

# 3. Goals

## 3.1 Primary Goals (MVP)

* Connect and sync QuickBooks data
* Compute and store KPIs in **fact tables**
* Display KPI dashboards with:

  * summary cards
  * trends
  * breakdowns
  * comparisons
* Enable filtering by key dimensions:

  * customer
  * vendor
  * category
  * product
* Support period comparisons (MoM, etc.)

---

## 3.2 Secondary Goals (Post-MVP)

* AI explanations (copilot)
* financial memory system
* anomaly detection
* predictive cash flow

---

# 4. Scope Clarification (Critical Alignment)

## ✅ INCLUDED IN MVP

* KPI Dashboard (Executive + drilldowns)
* Fact + dimension model
* Precomputed metrics
* Filters + comparisons
* AR/AP aging
* Revenue + expense breakdowns

## ❌ EXCLUDED FROM MVP (Phase 2+)

* AI copilot
* financial memory
* anomaly detection
* forecasting engine

👉 These remain in the vision but **not in MVP delivery scope**

---

# 5. Target Users

### SMB Owner

* “Are we profitable?”
* “How much cash do we have?”
* “Who owes us money?”

### Operator / GM

* “What changed this month?”
* “Where are expenses increasing?”
* “Who are top customers?”

### Fractional CFO

* trend analysis
* KPI validation
* breakdown analysis

---

# 6. KPI Scope (Aligned to Data Model)

All KPIs must exist in:
👉 `fact_financial_metrics`

---

## 6.1 Executive KPIs

* total_revenue
* gross_profit
* net_profit
* cash_on_hand
* net_cash_flow
* ar_balance
* ap_balance
* burn_rate
* runway_months

---

## 6.2 Revenue KPIs

* revenue_by_period
* revenue_growth_pct
* revenue_by_customer
* revenue_by_product
* avg_invoice_value

👉 Uses:

* `fact_financial_metrics`
* `fact_revenue_breakdown`

---

## 6.3 Expense KPIs

* total_expenses
* expense_by_category
* expense_trend

👉 Uses:

* `fact_financial_metrics`
* `fact_expense_breakdown`

---

## 6.4 Cash Flow KPIs

* inflow
* outflow
* net_cash_flow
* runway

👉 Uses:

* `fact_financial_metrics`

---

## 6.5 AR/AP KPIs

* ar_balance
* ap_balance
* dso
* dpo
* aging_buckets

👉 Uses:

* `fact_financial_metrics`
* `fact_ar_ap_breakdown`

---

# 7. Product Features (MVP-Aligned)

---

## 7.1 Authentication & Tenant Management

* secure login
* organization context
* org-scoped queries (`organization_id`)

---

## 7.2 QuickBooks Sync (Data Layer Dependency)

* OAuth connection
* initial + incremental sync
* sync status

⚠️ Note:
Dashboard depends on **precomputed data**, not live QB queries.

---

## 7.3 Dashboard Views

### A. Executive Dashboard

* KPI cards
* comparison deltas
* revenue + profit trend charts

---

### B. Revenue Dashboard

* revenue trend
* revenue by customer
* revenue by product/category

---

### C. Expenses Dashboard

* total expenses
* category breakdown
* vendor breakdown

---

### D. Cash Flow Dashboard

* inflow vs outflow
* net cash flow
* runway

---

### E. AR / AP Dashboard

* AR/AP summary
* aging buckets
* overdue balances

---

## ❌ Removed from MVP Views

* AI Copilot
* Financial Memory Timeline
* Insights Feed

(These are Phase 2)

---

# 8. Functional Requirements (Aligned)

---

## 8.1 Data Sync Layer

* ingest QuickBooks data
* normalize into dimension tables
* feed KPI aggregation pipeline

---

## 8.2 KPI Engine (Core System)

* compute metrics per:

  * period
  * dimension (customer/vendor/category/product)
* store results in:

  * `fact_financial_metrics`
  * `fact_kpi_comparisons`
  * breakdown tables

---

## 8.3 Dashboard Query Layer

* reads ONLY from fact tables
* supports:

  * period filters
  * dimension filters
  * comparisons

---

## ❌ Removed from MVP Functional Scope

* memory engine
* insight generation
* AI commentary

---

# 9. Data Model Alignment

This PRD now maps directly to:

## Fact Tables

* `fact_financial_metrics`
* `fact_kpi_comparisons`
* `fact_revenue_breakdown`
* `fact_expense_breakdown`
* `fact_ar_ap_breakdown`

## Dimension Tables

* customers
* vendors
* categories
* products
* accounts

## Period Table

* `dashboard_periods`

---

# 10. Next.js App Structure (Aligned)

```txt
/app
  /(auth)
  /dashboard
  /revenue
  /expenses
  /cashflow
  /ar-ap
  /settings

/components
  /charts
  /kpi-cards
  /tables
  /filters

/lib
  /kpi
  /zerodb
  /quickbooks

/api
  /kpis/summary
  /kpis/trends
  /kpis/breakdowns
  /sync
```

---

# 11. UI / UX Requirements

## Global

* date range selector
* organization context
* filters:

  * customer
  * vendor
  * category
  * product

---

## Dashboard Layout

1. KPI cards row
2. trend charts
3. breakdown tables

---

## ❌ Removed from MVP UX

* copilot panel
* memory panel
* insights feed

---

# 12. MVP Screens

* Executive Overview
* Revenue Dashboard
* Expense Dashboard
* Cash Flow Dashboard
* AR/AP Dashboard

---

# 13. Success Metrics (MVP)

* time to first dashboard load
* KPI query performance
* dashboard usage frequency
* accuracy of KPI calculations
* % of successful data syncs

---

# 14. Key Architectural Principle (Final Alignment)

👉 **DO NOT compute KPIs at query time**

All dashboard reads must come from:

* `fact_financial_metrics`
* precomputed comparison tables
* breakdown tables

---

# 15. Strategic Positioning

This MVP is:

* not just a UI
* not just a data sync tool

It is:

> A **financial analytics layer** that becomes the foundation for an **AI-native CFO system**

---

# 🔥 What Changed (Important)

### Removed from MVP (but preserved for roadmap)

* AI Copilot
* Financial Memory
* Insight Engine

### Clarified

* strict fact-table architecture
* KPI dictionary alignment
* dashboard-only scope
* separation of concerns

---



Just say the word 👍
