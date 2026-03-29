import type { MetricDefinition } from '@/lib/types/metrics';

export const METRIC_DICTIONARY: MetricDefinition[] = [
  // Revenue
  { metric_name: 'total_revenue', display_name: 'Total Revenue', description: 'Total income from all sources in the period', metric_unit: 'currency', metric_category: 'revenue', formula_text: 'SUM(income transactions)', is_active: true, sort_order: 1 },
  { metric_name: 'revenue_growth_pct', display_name: 'Revenue Growth', description: 'Percentage change in revenue vs prior period', metric_unit: 'percent', metric_category: 'revenue', formula_text: '(current_revenue - prior_revenue) / prior_revenue * 100', is_active: true, sort_order: 2 },
  { metric_name: 'avg_invoice_value', display_name: 'Avg Invoice Value', description: 'Average value per invoice in the period', metric_unit: 'currency', metric_category: 'revenue', formula_text: 'total_revenue / invoice_count', is_active: true, sort_order: 3 },

  // Profitability
  { metric_name: 'gross_profit', display_name: 'Gross Profit', description: 'Revenue minus cost of goods sold', metric_unit: 'currency', metric_category: 'profitability', formula_text: 'total_revenue - cogs', is_active: true, sort_order: 10 },
  { metric_name: 'gross_margin_pct', display_name: 'Gross Margin', description: 'Gross profit as a percentage of revenue', metric_unit: 'percent', metric_category: 'profitability', formula_text: 'gross_profit / total_revenue * 100', is_active: true, sort_order: 11 },
  { metric_name: 'net_profit', display_name: 'Net Profit', description: 'Revenue minus all expenses', metric_unit: 'currency', metric_category: 'profitability', formula_text: 'total_revenue - total_expenses', is_active: true, sort_order: 12 },
  { metric_name: 'net_margin_pct', display_name: 'Net Margin', description: 'Net profit as a percentage of revenue', metric_unit: 'percent', metric_category: 'profitability', formula_text: 'net_profit / total_revenue * 100', is_active: true, sort_order: 13 },

  // Cash Flow
  { metric_name: 'cash_on_hand', display_name: 'Cash on Hand', description: 'Total cash available across all bank accounts', metric_unit: 'currency', metric_category: 'cashflow', formula_text: 'SUM(bank_account_balances)', is_active: true, sort_order: 20 },
  { metric_name: 'net_cash_flow', display_name: 'Net Cash Flow', description: 'Cash inflows minus cash outflows for the period', metric_unit: 'currency', metric_category: 'cashflow', formula_text: 'cash_inflow - cash_outflow', is_active: true, sort_order: 21 },
  { metric_name: 'burn_rate', display_name: 'Burn Rate', description: 'Average monthly cash outflow', metric_unit: 'currency', metric_category: 'cashflow', formula_text: 'AVG(monthly_cash_outflow)', is_active: true, sort_order: 22 },
  { metric_name: 'runway_months', display_name: 'Cash Runway', description: 'Months of operation remaining at current burn rate', metric_unit: 'months', metric_category: 'cashflow', formula_text: 'cash_on_hand / burn_rate', is_active: true, sort_order: 23 },

  // AR
  { metric_name: 'ar_balance', display_name: 'AR Balance', description: 'Total accounts receivable outstanding', metric_unit: 'currency', metric_category: 'ar', formula_text: 'SUM(outstanding_invoices)', is_active: true, sort_order: 30 },
  { metric_name: 'dso', display_name: 'DSO', description: 'Days Sales Outstanding — average days to collect payment', metric_unit: 'days', metric_category: 'ar', formula_text: '(ar_balance / total_revenue) * days_in_period', is_active: true, sort_order: 31 },
  { metric_name: 'overdue_invoice_amount', display_name: 'Overdue Amount', description: 'Total value of invoices past due date', metric_unit: 'currency', metric_category: 'ar', formula_text: 'SUM(invoices WHERE due_date < today)', is_active: true, sort_order: 32 },

  // AP
  { metric_name: 'ap_balance', display_name: 'AP Balance', description: 'Total accounts payable outstanding', metric_unit: 'currency', metric_category: 'ap', formula_text: 'SUM(outstanding_bills)', is_active: true, sort_order: 40 },
  { metric_name: 'dpo', display_name: 'DPO', description: 'Days Payable Outstanding — average days to pay vendors', metric_unit: 'days', metric_category: 'ap', formula_text: '(ap_balance / cogs) * days_in_period', is_active: true, sort_order: 41 },

  // Expenses
  { metric_name: 'total_expenses', display_name: 'Total Expenses', description: 'Total operating expenses in the period', metric_unit: 'currency', metric_category: 'expense', formula_text: 'SUM(expense transactions)', is_active: true, sort_order: 50 },
  { metric_name: 'operating_expense_ratio', display_name: 'OpEx Ratio', description: 'Operating expenses as percentage of revenue', metric_unit: 'percent', metric_category: 'expense', formula_text: 'total_expenses / total_revenue * 100', is_active: true, sort_order: 51 },

  // Customer
  { metric_name: 'top_customer_concentration_pct', display_name: 'Top Customer %', description: 'Revenue concentration from top customer', metric_unit: 'percent', metric_category: 'customer', formula_text: 'top_customer_revenue / total_revenue * 100', is_active: true, sort_order: 60 },
];

export const EXECUTIVE_METRICS = [
  'total_revenue', 'gross_profit', 'net_profit', 'cash_on_hand',
  'net_cash_flow', 'ar_balance', 'ap_balance', 'burn_rate', 'runway_months',
];
