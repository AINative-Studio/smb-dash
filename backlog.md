Here’s a **product backlog for the KPI Dashboard MVP** aligned to the PRD and the dashboard-only data model.

I’ve structured it as:

* **Epics**
* **User stories**
* **Suggested acceptance criteria**
* **Priority guidance**

This is written so you can drop it into Notion, Linear, Jira, or Shortcut with minimal cleanup.

---

# KPI Dashboard MVP Backlog

## Epic 1: Workspace, Auth, and Tenant Context

### Goal

Enable a user to securely access the KPI dashboard within the correct organization context.

### User Story 1.1

**As a user, I want to sign in securely so that I can access my dashboard.**

**Acceptance Criteria**

* User can sign in using supported auth method.
* Invalid credentials are rejected with clear feedback.
* Authenticated users are redirected to the dashboard home.
* Session persists across page refresh.
* Signed-out users cannot access protected dashboard routes.

**Priority:** P0

---

### User Story 1.2

**As a user, I want my dashboard to load within the correct organization so that I only see my company’s data.**

**Acceptance Criteria**

* Every dashboard query is scoped by `organization_id`.
* Users cannot access data from another organization.
* Active organization context is available in the app shell.
* Dashboard APIs reject requests missing valid org context.

**Priority:** P0

---

### User Story 1.3

**As a user, I want a clean dashboard shell with navigation so that I can move between KPI views easily.**

**Acceptance Criteria**

* Global navigation includes Executive, Revenue, Expenses, Cash Flow, AR/AP, and Settings.
* Current section is visually highlighted.
* Responsive layout works on desktop and tablet.
* App shell displays organization name and current date range context.

**Priority:** P1

---

## Epic 2: Reporting Periods and Global Filters

### Goal

Support standardized date ranges and cross-dashboard filtering.

### User Story 2.1

**As a user, I want to select a reporting period so that I can analyze the right timeframe.**

**Acceptance Criteria**

* User can select predefined date ranges: current month, last month, quarter, year-to-date.
* Selected period maps to a valid `dashboard_periods` record.
* Dashboard content updates when the period changes.
* Selected period is shown consistently across all KPI views.

**Priority:** P0

---

### User Story 2.2

**As a user, I want comparison periods so that I can understand whether performance is improving or declining.**

**Acceptance Criteria**

* User can compare current period against previous period and prior year equivalent where available.
* Summary cards show current value, prior value, and delta.
* Comparison logic reads from `fact_kpi_comparisons`.
* Missing comparisons fail gracefully with clear empty states.

**Priority:** P0

---

### User Story 2.3

**As a user, I want to filter the dashboard by customer, vendor, category, product, or account so that I can drill into performance drivers.**

**Acceptance Criteria**

* Global filters are available where relevant.
* Selected filters update charts, KPI cards, and breakdown tables.
* Filters only show valid values for the current organization.
* Multiple filters can be combined without breaking queries.

**Priority:** P1

---

## Epic 3: KPI Metric Dictionary and Dashboard Semantics

### Goal

Create a reliable KPI vocabulary so the dashboard is consistent and understandable.

### User Story 3.1

**As a product team, we want a defined KPI dictionary so that all dashboard metrics use the correct names, units, and meanings.**

**Acceptance Criteria**

* Metric definitions exist for all MVP KPIs.
* Each metric has a unique `metric_name`.
* Each metric includes display name, unit, category, and formula description.
* Dashboard UI reads labels from `metric_definitions` rather than hardcoded strings.

**Priority:** P0

---

### User Story 3.2

**As a user, I want KPI labels and units to be consistent so that I can trust what I’m seeing.**

**Acceptance Criteria**

* Currency metrics render as currency.
* Percent metrics render as percentages.
* Count, day, and month metrics render with correct units.
* No KPI card uses ambiguous naming.

**Priority:** P0

---

## Epic 4: Executive KPI Summary Dashboard

### Goal

Deliver the main overview page with top-level financial health metrics.

### User Story 4.1

**As an SMB owner, I want a summary of core KPIs so that I can understand business health at a glance.**

**Acceptance Criteria**

* Executive dashboard shows KPI cards for:

  * Total Revenue
  * Gross Profit
  * Net Profit
  * Cash on Hand
  * Net Cash Flow
  * AR Balance
  * AP Balance
  * Burn Rate
  * Cash Runway
* Each card shows current value and period comparison where available.
* Cards are populated from `fact_financial_metrics` and `fact_kpi_comparisons`.
* Missing data shows a clear placeholder state.

**Priority:** P0

---

### User Story 4.2

**As a user, I want KPI cards to show whether a metric is up or down so that I can quickly spot changes.**

**Acceptance Criteria**

* Cards display absolute and/or percent delta.
* Positive/negative change states are visually distinguishable.
* Delta is based on selected comparison type.
* Hover or details state shows comparison basis.

**Priority:** P0

---

### User Story 4.3

**As a user, I want a top-level trend chart so that I can see financial momentum over time.**

**Acceptance Criteria**

* Executive dashboard includes at least 2 trend charts:

  * Revenue trend
  * Net profit or cash flow trend
* Charts read from `fact_metric_trends` or period series from `fact_financial_metrics`.
* Period labels align with selected timeframe granularity.
* Empty or sparse data is handled gracefully.

**Priority:** P1

---

## Epic 5: Revenue Dashboard

### Goal

Enable revenue analysis by period and segment.

### User Story 5.1

**As a user, I want to view revenue over time so that I can monitor growth.**

**Acceptance Criteria**

* Revenue page includes total revenue trend by selected periods.
* Revenue growth % is visible for current vs prior period.
* Chart supports switching date range.
* Revenue values come from `fact_financial_metrics`.

**Priority:** P0

---

### User Story 5.2

**As a user, I want revenue broken down by customer so that I can see who drives the business.**

**Acceptance Criteria**

* Revenue dashboard includes a table or chart of revenue by customer.
* Top customers can be ranked descending by revenue amount.
* Breakdown reads from `fact_revenue_breakdown`.
* User can click into a customer filter state.

**Priority:** P0

---

### User Story 5.3

**As a user, I want revenue broken down by product or category so that I can identify what is selling best.**

**Acceptance Criteria**

* Revenue dashboard supports breakdown by product and/or revenue category.
* Breakdown respects global filters and selected period.
* Average invoice value is available where data exists.
* Results sort and paginate cleanly if needed.

**Priority:** P1

---

## Epic 6: Expense Dashboard

### Goal

Show expense performance and cost drivers.

### User Story 6.1

**As a user, I want to see total expenses and expense trend so that I can monitor spending.**

**Acceptance Criteria**

* Expenses page shows total expenses for the current period.
* Trend chart shows expense movement over time.
* Comparison against previous period is available.
* Data reads from `fact_financial_metrics`.

**Priority:** P0

---

### User Story 6.2

**As a user, I want expenses broken down by category so that I can identify major cost drivers.**

**Acceptance Criteria**

* Expense breakdown by category is shown in chart or table form.
* Breakdown reads from `fact_expense_breakdown`.
* Categories map to `dimension_categories`.
* User can filter into one category and see updated dashboard state.

**Priority:** P0

---

### User Story 6.3

**As a user, I want to see expenses by vendor so that I can understand vendor concentration and spend patterns.**

**Acceptance Criteria**

* Expense page supports a vendor-level breakdown.
* Results are sortable by spend.
* Vendor data comes from `dimension_vendors` + `fact_expense_breakdown`.
* Empty vendor states are handled cleanly.

**Priority:** P1

---

## Epic 7: Cash Flow Dashboard

### Goal

Help users understand inflows, outflows, and liquidity signals.

### User Story 7.1

**As a user, I want to see net cash flow over time so that I can understand how cash is moving.**

**Acceptance Criteria**

* Cash Flow page shows inflow, outflow, and net cash flow by period.
* Trend chart supports selected reporting window.
* Net cash flow value is visible as a summary card.
* Data is sourced from `fact_financial_metrics`.

**Priority:** P0

---

### User Story 7.2

**As a user, I want to see cash on hand and runway so that I can assess near-term financial risk.**

**Acceptance Criteria**

* Cash on hand and runway months are visible on the Cash Flow page and/or Executive page.
* Runway metric uses stored KPI values, not frontend calculation.
* Units are displayed correctly.
* Missing runway values show a defined fallback state.

**Priority:** P0

---

## Epic 8: AR/AP Dashboard

### Goal

Provide visibility into receivables, payables, and aging.

### User Story 8.1

**As a user, I want to see AR and AP balances so that I know what is owed to and by the business.**

**Acceptance Criteria**

* AR/AP page shows summary cards for AR balance and AP balance.
* Current values come from `fact_financial_metrics`.
* Comparison values are shown when available.
* Cards link to detailed aging tables on the same page.

**Priority:** P0

---

### User Story 8.2

**As a user, I want AR aging buckets so that I can identify collection risk.**

**Acceptance Criteria**

* AR aging table shows current, 1–30, 31–60, 61–90, and 90+ balances.
* Aging values read from `fact_ar_ap_breakdown`.
* Aging can be viewed by customer.
* Overdue totals are highlighted clearly.

**Priority:** P0

---

### User Story 8.3

**As a user, I want AP aging buckets so that I can understand upcoming payment obligations.**

**Acceptance Criteria**

* AP aging table shows current, 1–30, 31–60, 61–90, and 90+ balances.
* Aging values read from `fact_ar_ap_breakdown`.
* Aging can be viewed by vendor.
* Page supports switching between AR and AP views without losing date filters.

**Priority:** P0

---

### User Story 8.4

**As a user, I want DSO and DPO visible so that I can monitor collections and payment efficiency.**

**Acceptance Criteria**

* DSO and DPO are rendered as KPI cards or summary metrics.
* Metrics come from `fact_financial_metrics`.
* Units display as days.
* Comparison period delta is shown where available.

**Priority:** P1

---

## Epic 9: Dashboard Drilldowns and Breakdown Tables

### Goal

Let users move from summary KPI to supporting detail.

### User Story 9.1

**As a user, I want to click from a summary KPI into a relevant breakdown so that I can understand what drives the number.**

**Acceptance Criteria**

* KPI cards link to the relevant dashboard section or filtered view.
* Revenue KPIs route to revenue details.
* Expense KPIs route to expense details.
* AR/AP KPIs route to aging details.
* Date and filter context persist through drilldown.

**Priority:** P1

---

### User Story 9.2

**As a user, I want sortable tables so that I can inspect the highest-value contributors first.**

**Acceptance Criteria**

* Breakdown tables support sort by amount, count, average value, and overdue amount where applicable.
* Sorting updates instantly on current dataset.
* Tables show default descending sort for the most important value.
* Large tables paginate or virtualize as needed.

**Priority:** P1

---

## Epic 10: Saved Views and Dashboard Personalization

### Goal

Allow users to save useful dashboard filter states.

### User Story 10.1

**As a user, I want to save a dashboard view so that I can quickly return to my preferred reporting setup.**

**Acceptance Criteria**

* User can save current filters and layout as a named view.
* Saved view persists to `dashboard_views`.
* User can load a saved view later.
* User can set one default view.

**Priority:** P2

---

### User Story 10.2

**As a user, I want my default view to load automatically so that the dashboard starts in the state I use most.**

**Acceptance Criteria**

* Default saved view is applied on dashboard load.
* If no default exists, system loads the standard default view.
* Invalid saved views fail gracefully.

**Priority:** P2

---

## Epic 11: KPI Data APIs

### Goal

Provide stable backend endpoints for dashboard rendering.

### User Story 11.1

**As a frontend system, I want a KPI summary API so that I can render executive cards efficiently.**

**Acceptance Criteria**

* API returns summary metrics for selected org, period, and comparison.
* API validates organization and filter scope.
* Response includes metric name, value, unit, comparison, and delta.
* API latency is acceptable for dashboard usage.

**Priority:** P0

---

### User Story 11.2

**As a frontend system, I want a trend API so that I can render time-series charts.**

**Acceptance Criteria**

* API returns period-aligned points for requested metrics.
* Supports org scope and current filters.
* Supports at least revenue, net profit, expenses, cash flow.
* Returns empty arrays instead of failing when no data exists.

**Priority:** P0

---

### User Story 11.3

**As a frontend system, I want breakdown APIs so that I can render customer, vendor, category, and AR/AP tables.**

**Acceptance Criteria**

* Revenue breakdown endpoint supports customer/product/category grouping.
* Expense breakdown endpoint supports category/vendor grouping.
* AR/AP breakdown endpoint supports balance type and aging buckets.
* APIs return paginable and sortable datasets.

**Priority:** P0

---

## Epic 12: KPI Data Population and Readiness

### Goal

Ensure the dashboard fact tables are populated correctly for MVP.

### User Story 12.1

**As a system, I want dashboard periods populated so that KPI data can be grouped consistently.**

**Acceptance Criteria**

* Period records can be generated for daily, monthly, quarterly, yearly windows.
* No duplicate periods exist for the same organization and type.
* Labels are human-readable.
* Period lookup works for selected date range logic.

**Priority:** P0

---

### User Story 12.2

**As a system, I want financial metrics loaded into fact tables so that the dashboard can render from precomputed data.**

**Acceptance Criteria**

* Core KPI rows exist in `fact_financial_metrics` for MVP metrics.
* Metrics are stored by org and period.
* Segmented metrics can be stored by customer/vendor/category/product where relevant.
* Re-runs do not create invalid duplicates.

**Priority:** P0

---

### User Story 12.3

**As a system, I want comparison records populated so that KPI deltas do not require live recalculation.**

**Acceptance Criteria**

* `fact_kpi_comparisons` is populated for supported metrics.
* Comparison types include at least previous period and previous month.
* Comparison values match source metrics for both periods.
* Delta math is validated.

**Priority:** P0

---

### User Story 12.4

**As a system, I want revenue, expense, and aging breakdown facts populated so that drilldown pages have reliable data.**

**Acceptance Criteria**

* `fact_revenue_breakdown` contains revenue totals, invoice counts, and avg invoice values where available.
* `fact_expense_breakdown` contains expense totals by category/vendor/account.
* `fact_ar_ap_breakdown` contains aging buckets and overdue totals.
* Fact rows are org-scoped and period-scoped.

**Priority:** P0

---

## Epic 13: Empty States, Validation, and UX Reliability

### Goal

Make the MVP usable even when data is incomplete or sparse.

### User Story 13.1

**As a user, I want clear empty states so that I know whether data is unavailable, still loading, or not yet configured.**

**Acceptance Criteria**

* Empty states exist for no KPI data, no comparison data, and no breakdown rows.
* Empty states use plain language.
* Dashboard never shows broken components for missing data.
* Empty state guides user toward next action where appropriate.

**Priority:** P0

---

### User Story 13.2

**As a user, I want loading and error states so that I know what is happening when the dashboard updates.**

**Acceptance Criteria**

* KPI cards have loading skeletons.
* Charts and tables have loading states.
* API failures show useful retry-friendly messages.
* Errors do not crash the full dashboard page.

**Priority:** P0

---

## Epic 14: Performance and MVP Quality

### Goal

Ensure the dashboard feels fast and trustworthy.

### User Story 14.1

**As a user, I want the dashboard to load quickly so that it feels usable in day-to-day operations.**

**Acceptance Criteria**

* Executive dashboard initial load is optimized for cached reads.
* APIs query fact tables, not raw transactional records.
* Key pages render within acceptable target performance for MVP.
* Large tables do not block page interactivity.

**Priority:** P1

---

### User Story 14.2

**As a team, we want dashboard calculations and queries tested so that KPI outputs are trustworthy.**

**Acceptance Criteria**

* Core KPI metrics have backend tests for correctness.
* Comparison delta calculations are tested.
* Filter scoping by organization is tested.
* Breakdown aggregation logic is tested.

**Priority:** P0

---

# Suggested MVP Scope Cut

## P0 Must-Have

* Epic 1: Auth + org scoping
* Epic 2: reporting periods + basic comparison
* Epic 3: metric definitions
* Epic 4: executive summary dashboard
* Epic 5: revenue dashboard core
* Epic 6: expense dashboard core
* Epic 7: cash flow core
* Epic 8: AR/AP dashboard core
* Epic 11: KPI APIs
* Epic 12: fact table population
* Epic 13: empty/loading/error states
* Epic 14.2: KPI correctness tests

## P1 Should-Have

* Trend chart polish
* advanced filters
* drilldowns from cards
* vendor/customer deeper breakdowns
* performance optimization

## P2 Nice-to-Have

* saved views
* default personalized dashboard state

---

# Suggested Story Sequencing

## Sprint 1

* Epic 1
* Epic 2
* Epic 3
* Epic 12.1
* Epic 12.2
* Epic 11.1
* Epic 4.1
* Epic 4.2
* Epic 13.1
* Epic 13.2

## Sprint 2

* Epic 11.2
* Epic 5.1
* Epic 5.2
* Epic 6.1
* Epic 6.2
* Epic 7.1
* Epic 7.2
* Epic 14.2

## Sprint 3

* Epic 11.3
* Epic 8.1
* Epic 8.2
* Epic 8.3
* Epic 9.1
* Epic 9.2
* Epic 5.3
* Epic 6.3
* Epic 14.1

---


