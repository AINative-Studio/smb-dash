# 📊 AINative KPI Dashboard

An **AI-native financial dashboard** that transforms QuickBooks data into real-time KPIs, trends, and business intelligence.

Built with:

* **Next.js** (frontend + API layer)
* **ZeroDB** (analytics + KPI storage)
* **QuickBooks API** (source of truth)

---

## 🚀 Overview

The AINative KPI Dashboard is a **financial intelligence layer** on top of accounting data.

Instead of raw transactions, it provides:

* KPI summary cards
* trend analysis
* revenue and expense breakdowns
* AR/AP aging insights
* fast, precomputed analytics via fact tables

This is the foundation for an **AI CFO system**.

---

## 🧠 Key Features

### 📈 Executive Dashboard

* Total Revenue
* Gross Profit / Net Profit
* Cash on Hand
* Net Cash Flow
* AR / AP Balances
* Burn Rate & Runway

### 📊 Analytics Views

* Revenue by customer, product, category
* Expense breakdown by category/vendor
* Cash flow trends
* AR/AP aging buckets

### ⚡ Performance-First Architecture

* Precomputed KPI fact tables
* Fast queries (no raw ledger scans)
* Multi-tenant isolation

### 🔍 Drilldowns

* Click from KPI → breakdown → detail
* Filter by customer, vendor, category, product

---

## 🏗️ Architecture

```txt
QuickBooks API
      ↓
Data Sync Layer (ETL)
      ↓
ZeroDB (Fact + Dimension Model)
      ↓
Next.js API Routes
      ↓
Dashboard UI (React)
```

---

## 🗂️ Project Structure

```txt
/app
  /(auth)
    /login
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
  /zerodb
  /quickbooks
  /kpi
  /auth

/api
  /kpis/summary
  /kpis/trends
  /kpis/breakdowns
  /sync
```

---

## 🧾 Data Model (Dashboard Layer)

### Core Concepts

* **Dimensions** → customers, vendors, categories, products, accounts
* **Facts** → KPI metrics, trends, breakdowns
* **Periods** → standardized reporting windows

---

### Key Tables

#### KPI Metrics

```sql
fact_financial_metrics
```

Stores all KPI values by period.

#### KPI Comparisons

```sql
fact_kpi_comparisons
```

Precomputed deltas (MoM, YoY).

#### Trends

```sql
fact_metric_trends
```

Time-series optimized for charts.

#### Breakdowns

```sql
fact_revenue_breakdown
fact_expense_breakdown
fact_ar_ap_breakdown
```

#### Dimensions

```sql
dimension_customers
dimension_vendors
dimension_categories
dimension_products
dimension_accounts
```

#### Periods

```sql
dashboard_periods
```

---

## 📊 KPI Coverage

### Executive

* Total Revenue
* Gross Profit
* Net Profit
* Cash on Hand
* Net Cash Flow
* AR / AP Balance
* Burn Rate
* Runway

### Revenue

* Revenue growth %
* Revenue by customer/product
* Avg invoice value

### Expenses

* Total expenses
* Expense by category/vendor

### Cash Flow

* Inflow / outflow
* Net cash flow
* Runway

### AR / AP

* Aging buckets
* DSO / DPO
* Overdue balances

---

## 🔌 API Endpoints

### KPI Summary

```http
GET /api/kpis/summary
```

### Trends

```http
GET /api/kpis/trends
```

### Breakdowns

```http
GET /api/kpis/breakdowns
```

### Sync

```http
POST /api/sync/run
GET  /api/sync/status
```

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-org/ainative-kpi-dashboard.git
cd ainative-kpi-dashboard
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Environment Variables

Create a `.env.local`:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ZeroDB
ZERODB_URL=
ZERODB_API_KEY=

# QuickBooks
QB_CLIENT_ID=
QB_CLIENT_SECRET=
QB_REDIRECT_URI=
QB_ENV=sandbox
```

---

### 4. Run the app

```bash
npm run dev
```

---

## 🔄 Data Flow

1. QuickBooks sync pulls:

   * invoices
   * payments
   * bills
   * expenses

2. ETL layer transforms into:

   * financial events
   * KPI aggregates

3. Aggregates stored in:

   * `fact_*` tables

4. Dashboard reads ONLY from:

   * fact tables (fast, predictable)

---

## 🧪 Testing

Focus areas:

* KPI calculation correctness
* period comparisons
* filter scoping
* aggregation integrity

Run:

```bash
npm run test
```

---

## 📦 MVP Scope

### Included

* Executive dashboard
* Revenue, Expense, Cash Flow, AR/AP pages
* KPI summary + trends
* breakdown tables
* global filters (date, basic segmentation)

### Not Included (yet)

* AI copilot
* financial memory
* anomaly detection
* forecasting

---

## ⚡ Performance Strategy

* Precompute all KPIs → no runtime aggregation
* Use indexed fact tables
* Cache API responses where possible
* Avoid joining raw transactional tables in UI queries

---

## 🔐 Multi-Tenant Design

* Every table scoped by `organization_id`
* API enforces org isolation
* No cross-tenant queries allowed

---

## 🧭 Roadmap

### Phase 1 (MVP)

* KPI dashboard
* breakdowns
* AR/AP aging
* comparisons

### Phase 2

* AI insights
* anomaly detection
* advanced filtering

### Phase 3

* AI CFO copilot
* financial memory (ZeroDB /memory)
* predictive cash flow

---

## 🧠 Philosophy

This is not just a dashboard.

It’s:

* a **decision engine**
* a **financial memory system**
* a **foundation for AI-native finance tools**

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Follow coding + testing standards
4. Submit PR with clear description

---

## 📄 License

MIT

---

## 🧬 AINative

Built by **AINative Studio**
→ [https://www.ainative.studio](https://www.ainative.studio)

---
