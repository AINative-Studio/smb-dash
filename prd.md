PRD: AINative Finance Dashboard

Product: AI-Native Finance Dashboard
Frontend: Next.js
Backend/Data Layer: ZeroDB
External Source: QuickBooks API
Primary Users: SMB owners, operators, finance managers, fractional CFOs

1. Product Overview

The AINative Finance Dashboard is a web-based financial intelligence workspace that connects to QuickBooks, extracts core accounting and operational metrics, stores normalized financial events and memory in ZeroDB, and presents both dashboard analytics and AI-generated insights.

The product should help users:

see financial health in one place
understand what changed and why
ask questions in natural language
track trends across revenue, profit, cash flow, receivables, payables, and customers
build durable “financial memory” that agents can use over time
2. Problem

QuickBooks contains the raw accounting data, but most SMBs struggle to:

turn raw entries into meaningful KPIs
see trend changes quickly
remember important financial events over time
extract strategic insights without a finance expert
connect operational context to accounting data

Users need a dashboard that is:

visual
simple
AI-assisted
memory-aware
fast enough for daily use
3. Goals
Primary Goals
Connect QuickBooks data and sync it into ZeroDB
Show core financial KPIs in a clean dashboard
Store financial observations and business context as memory
Enable AI agents to explain changes and recommend actions
Support daily/weekly/monthly financial review workflows
Secondary Goals
Predict near-term cash flow issues
Flag anomalies in expense, AR, and burn
Build customer/vendor intelligence over time
Power multi-tenant finance copilots
4. Target Users
SMB Owner

Wants fast answers:

How much money did we make?
Are we profitable?
Who owes us money?
Are expenses getting out of control?
Operator / GM

Wants clarity:

What changed this week?
Which customers matter most?
What is overdue?
Which expense categories are rising?
Fractional CFO / Advisor

Wants leverage:

trend analysis
commentary generation
scenario review
historical context and memory
5. Core User Stories
As a user, I can connect my QuickBooks account securely.
As a user, I can view a summary dashboard of core KPIs.
As a user, I can drill into revenue, expenses, AR, AP, cash flow, and customer performance.
As a user, I can ask natural-language questions about my finances.
As a user, I can see AI-generated explanations for KPI changes.
As a user, I can store and retrieve financial memory such as “March spike caused by annual insurance payment.”
As a user, I can view alerts for anomalies, overdue invoices, or runway risk.
As a user, I can compare periods: current month vs prior month, quarter, or year.
6. KPI Scope
6.1 Executive Summary KPIs
Total Revenue
Gross Profit
Net Profit
Cash on Hand
Net Cash Flow
AR Balance
AP Balance
Burn Rate
Cash Runway
Current Ratio
6.2 Revenue KPIs
Revenue by day/week/month
Revenue growth %
Revenue by customer
Revenue by product/service
Average invoice value
New vs returning customer revenue
6.3 Profitability KPIs
Gross margin %
Net margin %
Operating expense ratio
EBITDA proxy
Profit by category / class / service
6.4 Cash Flow KPIs
Cash in
Cash out
Net cash flow
30/60/90 day cash trend
Burn multiple
Runway estimate
6.5 Receivables KPIs
AR balance
DSO
overdue invoice count
overdue invoice amount
aging buckets
6.6 Payables KPIs
AP balance
DPO
unpaid bill count
aging buckets
6.7 Customer KPIs
active customers
top customers by revenue
customer concentration %
revenue per customer
estimated LTV proxy
6.8 Expense KPIs
total expenses
top expense categories
expense trend
fixed vs variable cost proxy
unusual spend spikes
7. Product Features
7.1 Authentication & Tenant Management
secure login
organization/workspace support
connect/disconnect QuickBooks
role-based access: owner, finance manager, analyst, viewer
7.2 QuickBooks Connection
OAuth flow for QuickBooks
initial sync
scheduled sync
manual resync
sync status dashboard
error handling/logging
7.3 Dashboard Views
A. Executive Dashboard
KPI cards
cash trend chart
revenue/profit trend chart
alerts panel
AI summary panel
B. Revenue Dashboard
revenue chart by period
top customers
top products/services
growth comparisons
C. Expenses Dashboard
expense breakdown
category trend
unusual category movement
D. Cash Flow Dashboard
inflow vs outflow chart
runway card
forecast module
E. AR / AP Dashboard
aging buckets
collections risk
payable schedule
overdue lists
F. Customer Intelligence Dashboard
revenue concentration
customer ranking
payment behavior trends
G. AI Copilot / Ask Finance
natural language query bar
examples:
Why did profit drop this month?
Which customers are most overdue?
What changed in cash flow last week?
grounded answers using ZeroDB + synced QuickBooks data
7.4 Alerts & Insights
expense anomaly detected
customer overdue threshold exceeded
burn acceleration
runway below threshold
margin compression
vendor concentration warning
7.5 Financial Memory
AI and users can store financial memories
examples:
“Annual insurance payment posted in March; not recurring monthly spend”
“Customer ABC shifted from net 15 to net 45 starting Q2”
“Revenue spike due to one-time enterprise contract”
memories become searchable and referenced in future analysis
8. Functional Requirements
8.1 Data Sync
ingest customers, invoices, payments, bills, vendors, items, accounts, journal summaries, and report snapshots
maintain sync cursor / watermark
store raw and normalized forms
support backfill and incremental sync
8.2 KPI Engine
compute KPI snapshots by period
store daily and monthly aggregates
support tenant-level and segmented analysis
recompute on backfill or corrections
8.3 Memory Engine
store structured and unstructured financial memory
support semantic search
support event replay
support importance and permanence tagging
support user-generated and AI-generated notes
8.4 Insight Generation
auto-generate commentary on KPI changes
cite underlying metrics and events
support explainability with traceable sources
8.5 Permissions
finance admins can edit memory and thresholds
viewers can see dashboards and ask questions
audit trail for edits and manual notes
9. Non-Functional Requirements
responsive UI for desktop first, tablet acceptable
load dashboard under 2 seconds for cached views
background sync resilient to QuickBooks API failures
tenant data isolation mandatory
encrypted tokens and secrets
observability for sync health and agent actions
10. Suggested Next.js App Structure
/app
  /(auth)
    /login
    /connect-quickbooks
  /dashboard
    /page.tsx
  /revenue
    /page.tsx
  /expenses
    /page.tsx
  /cashflow
    /page.tsx
  /ar-ap
    /page.tsx
  /customers
    /page.tsx
  /insights
    /page.tsx
  /memory
    /page.tsx
  /settings
    /page.tsx

/components
  /charts
  /kpi-cards
  /tables
  /filters
  /insights
  /copilot

/lib
  /quickbooks
  /zerodb
  /auth
  /kpi
  /memory
  /alerts

/api
  /quickbooks/connect
  /quickbooks/callback
  /sync/run
  /sync/status
  /kpis/query
  /memory/search
  /copilot/ask
11. UI / UX Requirements
Global UX
date range selector
organization selector
saved views
segment filters: customer, vendor, class, product, tag
export CSV/PDF
Dashboard UX
top row KPI cards
trend chart row
alerts + AI commentary row
drill-down tables below
Copilot UX
sticky ask bar
answer panel with:
summary
cited KPIs
related memories
suggested follow-up questions
12. Example MVP Screens
Executive Overview
Revenue Analysis
Cash Flow & Runway
AR/AP Aging
AI Insights Feed
Financial Memory Timeline
13. AI Behaviors

The finance copilot should:

explain KPI changes in plain English
compare current period vs prior period
use financial memory to add business context
distinguish recurring vs one-time events
suggest actions, not just observations

Example output:

Net profit fell 18% in March primarily due to a one-time insurance expense and slower collections from 3 top customers. This is consistent with the memory note saved on March 3 regarding annual policy renewal.

14. Success Metrics
time to first connected dashboard
sync success rate
dashboard weekly active use
number of natural language finance queries
percentage of AI explanations rated helpful
reduction in time spent preparing financial summaries
percentage of insights tied to traceable memory or source records
