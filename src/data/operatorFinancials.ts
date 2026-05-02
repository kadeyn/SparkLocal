// Financial Statements - P&L, Balance Sheet, Key Ratios

export interface PLLineItem {
  label: string
  q1: number
  q2: number
  q3: number
  q4: number
  isSubtotal?: boolean
  isTotal?: boolean
  indent?: number
}

export interface BalanceSheetItem {
  label: string
  current: number
  prior: number
  isSubtotal?: boolean
  isTotal?: boolean
  indent?: number
}

export interface Ratio {
  id: string
  label: string
  value: string
  target: string
  status: 'good' | 'warning' | 'critical'
  description: string
}

// Profit & Loss Statement (in thousands)
export const plStatement: PLLineItem[] = [
  // Revenue
  { label: 'Revenue', q1: 0, q2: 0, q3: 0, q4: 0, isSubtotal: true },
  { label: 'Take Revenue (12%)', q1: 28.4, q2: 42.6, q3: 64.0, q4: 89.6, indent: 1 },
  { label: 'Subscription Revenue', q1: 0, q2: 2.4, q3: 8.8, q4: 18.0, indent: 1 },
  { label: 'Other Revenue', q1: 0, q2: 0, q3: 0, q4: 1.2, indent: 1 },
  { label: 'Total Revenue', q1: 28.4, q2: 45.0, q3: 72.8, q4: 108.8, isSubtotal: true },

  // Cost of Revenue
  { label: 'Cost of Revenue', q1: 0, q2: 0, q3: 0, q4: 0, isSubtotal: true },
  { label: 'Payment Processing', q1: 2.1, q2: 3.4, q3: 5.5, q4: 8.2, indent: 1 },
  { label: 'Background Checks', q1: 1.8, q2: 2.4, q3: 3.2, q4: 4.0, indent: 1 },
  { label: 'Support & Trust/Safety', q1: 4.2, q2: 5.6, q3: 7.5, q4: 9.8, indent: 1 },
  { label: 'Total COGS', q1: 8.1, q2: 11.4, q3: 16.2, q4: 22.0, isSubtotal: true },

  { label: 'Gross Profit', q1: 20.3, q2: 33.6, q3: 56.6, q4: 86.8, isTotal: true },

  // Operating Expenses
  { label: 'Operating Expenses', q1: 0, q2: 0, q3: 0, q4: 0, isSubtotal: true },
  { label: 'Engineering & Product', q1: 45.0, q2: 52.0, q3: 60.0, q4: 68.0, indent: 1 },
  { label: 'Sales & Marketing', q1: 18.0, q2: 24.0, q3: 32.0, q4: 40.0, indent: 1 },
  { label: 'General & Administrative', q1: 12.0, q2: 14.0, q3: 16.0, q4: 18.0, indent: 1 },
  { label: 'Total OpEx', q1: 75.0, q2: 90.0, q3: 108.0, q4: 126.0, isSubtotal: true },

  { label: 'Operating Income (EBIT)', q1: -54.7, q2: -56.4, q3: -51.4, q4: -39.2, isTotal: true },

  // Other
  { label: 'Interest Income', q1: 0.8, q2: 0.7, q3: 0.5, q4: 0.4, indent: 1 },
  { label: 'Other Expense', q1: -0.2, q2: -0.2, q3: -0.3, q4: -0.3, indent: 1 },

  { label: 'Net Income (Loss)', q1: -54.1, q2: -55.9, q3: -51.2, q4: -39.1, isTotal: true },
]

// Balance Sheet (in thousands)
export const balanceSheet: BalanceSheetItem[] = [
  // Assets
  { label: 'ASSETS', current: 0, prior: 0, isSubtotal: true },
  { label: 'Cash & Equivalents', current: 142.5, prior: 180.0, indent: 1 },
  { label: 'Accounts Receivable', current: 8.2, prior: 3.4, indent: 1 },
  { label: 'Prepaid Expenses', current: 4.8, prior: 6.2, indent: 1 },
  { label: 'Total Current Assets', current: 155.5, prior: 189.6, isSubtotal: true },

  { label: 'Property & Equipment (net)', current: 2.4, prior: 1.8, indent: 1 },
  { label: 'Intangible Assets', current: 0, prior: 0, indent: 1 },
  { label: 'Other Assets', current: 1.2, prior: 0.8, indent: 1 },
  { label: 'Total Assets', current: 159.1, prior: 192.2, isTotal: true },

  // Liabilities
  { label: 'LIABILITIES', current: 0, prior: 0, isSubtotal: true },
  { label: 'Accounts Payable', current: 6.8, prior: 4.2, indent: 1 },
  { label: 'Accrued Expenses', current: 12.4, prior: 8.6, indent: 1 },
  { label: 'Deferred Revenue', current: 2.1, prior: 0, indent: 1 },
  { label: 'Total Current Liabilities', current: 21.3, prior: 12.8, isSubtotal: true },

  { label: 'Long-term Debt', current: 0, prior: 0, indent: 1 },
  { label: 'Other Liabilities', current: 0.5, prior: 0.3, indent: 1 },
  { label: 'Total Liabilities', current: 21.8, prior: 13.1, isSubtotal: true },

  // Equity
  { label: 'EQUITY', current: 0, prior: 0, isSubtotal: true },
  { label: 'Common Stock', current: 0.1, prior: 0.1, indent: 1 },
  { label: 'Additional Paid-in Capital', current: 500.0, prior: 500.0, indent: 1 },
  { label: 'Retained Earnings', current: -362.8, prior: -320.9, indent: 1 },
  { label: 'Total Equity', current: 137.3, prior: 179.2, isSubtotal: true },

  { label: 'Total Liabilities & Equity', current: 159.1, prior: 192.3, isTotal: true },
]

// Key Financial Ratios
export const keyRatios: Ratio[] = [
  {
    id: 'gross-margin',
    label: 'Gross Margin',
    value: '71.5%',
    target: '70%+',
    status: 'good',
    description: 'Revenue minus cost of goods sold, divided by revenue',
  },
  {
    id: 'burn-rate',
    label: 'Monthly Burn Rate',
    value: '$42.3K',
    target: '<$50K',
    status: 'good',
    description: 'Average monthly cash consumption',
  },
  {
    id: 'runway',
    label: 'Cash Runway',
    value: '3.4 months',
    target: '6+ months',
    status: 'warning',
    description: 'Months of operation remaining at current burn rate',
  },
  {
    id: 'ltv-cac',
    label: 'LTV:CAC Ratio',
    value: '2.1:1',
    target: '3:1+',
    status: 'warning',
    description: 'Customer lifetime value divided by acquisition cost',
  },
  {
    id: 'take-rate',
    label: 'Effective Take Rate',
    value: '11.8%',
    target: '12%',
    status: 'good',
    description: 'Actual revenue captured per dollar of GMV',
  },
  {
    id: 'nrr',
    label: 'Net Revenue Retention',
    value: '108%',
    target: '100%+',
    status: 'good',
    description: 'Revenue retained from existing customers including expansion',
  },
  {
    id: 'cac-payback',
    label: 'CAC Payback',
    value: '8.2 months',
    target: '<12 months',
    status: 'good',
    description: 'Months to recover customer acquisition cost',
  },
  {
    id: 'magic-number',
    label: 'Magic Number',
    value: '0.62',
    target: '0.75+',
    status: 'warning',
    description: 'Net new ARR / Sales & Marketing spend (quarterly)',
  },
]

export type StatementView = 'pl' | 'balance' | 'ratios'
