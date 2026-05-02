// Cash Flow - 13-week forecast with scenarios

export type Scenario = 'bull' | 'base' | 'bear'

export interface CashFlowWeek {
  week: number
  label: string
  inflows: {
    takeRevenue: number
    subscriptions: number
    other: number
  }
  outflows: {
    payroll: number
    marketing: number
    infrastructure: number
    operations: number
    other: number
  }
}

export interface ScenarioData {
  id: Scenario
  label: string
  description: string
  assumptions: string[]
  weeks: CashFlowWeek[]
}

// Base scenario data
const baseWeeks: CashFlowWeek[] = [
  {
    week: 1,
    label: 'W1',
    inflows: { takeRevenue: 3400, subscriptions: 0, other: 0 },
    outflows: { payroll: 8500, marketing: 2000, infrastructure: 800, operations: 500, other: 200 },
  },
  {
    week: 2,
    label: 'W2',
    inflows: { takeRevenue: 3600, subscriptions: 0, other: 0 },
    outflows: { payroll: 8500, marketing: 2200, infrastructure: 800, operations: 500, other: 200 },
  },
  {
    week: 3,
    label: 'W3',
    inflows: { takeRevenue: 3800, subscriptions: 0, other: 0 },
    outflows: { payroll: 8500, marketing: 2400, infrastructure: 800, operations: 550, other: 200 },
  },
  {
    week: 4,
    label: 'W4',
    inflows: { takeRevenue: 4000, subscriptions: 500, other: 0 },
    outflows: { payroll: 8500, marketing: 2500, infrastructure: 800, operations: 550, other: 200 },
  },
  {
    week: 5,
    label: 'W5',
    inflows: { takeRevenue: 4200, subscriptions: 500, other: 0 },
    outflows: { payroll: 8500, marketing: 2600, infrastructure: 850, operations: 600, other: 200 },
  },
  {
    week: 6,
    label: 'W6',
    inflows: { takeRevenue: 4400, subscriptions: 500, other: 0 },
    outflows: { payroll: 8500, marketing: 2700, infrastructure: 850, operations: 600, other: 200 },
  },
  {
    week: 7,
    label: 'W7',
    inflows: { takeRevenue: 4600, subscriptions: 1000, other: 0 },
    outflows: { payroll: 9000, marketing: 2800, infrastructure: 850, operations: 600, other: 250 },
  },
  {
    week: 8,
    label: 'W8',
    inflows: { takeRevenue: 4800, subscriptions: 1000, other: 0 },
    outflows: { payroll: 9000, marketing: 2900, infrastructure: 900, operations: 650, other: 250 },
  },
  {
    week: 9,
    label: 'W9',
    inflows: { takeRevenue: 5000, subscriptions: 1000, other: 0 },
    outflows: { payroll: 9000, marketing: 3000, infrastructure: 900, operations: 650, other: 250 },
  },
  {
    week: 10,
    label: 'W10',
    inflows: { takeRevenue: 5200, subscriptions: 1500, other: 0 },
    outflows: { payroll: 9000, marketing: 3100, infrastructure: 900, operations: 700, other: 250 },
  },
  {
    week: 11,
    label: 'W11',
    inflows: { takeRevenue: 5400, subscriptions: 1500, other: 0 },
    outflows: { payroll: 9500, marketing: 3200, infrastructure: 950, operations: 700, other: 300 },
  },
  {
    week: 12,
    label: 'W12',
    inflows: { takeRevenue: 5600, subscriptions: 1500, other: 0 },
    outflows: { payroll: 9500, marketing: 3300, infrastructure: 950, operations: 750, other: 300 },
  },
  {
    week: 13,
    label: 'W13',
    inflows: { takeRevenue: 5800, subscriptions: 2000, other: 0 },
    outflows: { payroll: 9500, marketing: 3400, infrastructure: 1000, operations: 750, other: 300 },
  },
]

// Generate bull scenario (20% higher inflows, same outflows)
const bullWeeks: CashFlowWeek[] = baseWeeks.map((w) => ({
  ...w,
  inflows: {
    takeRevenue: Math.round(w.inflows.takeRevenue * 1.2),
    subscriptions: Math.round(w.inflows.subscriptions * 1.3),
    other: w.inflows.other,
  },
}))

// Generate bear scenario (15% lower inflows, same outflows)
const bearWeeks: CashFlowWeek[] = baseWeeks.map((w) => ({
  ...w,
  inflows: {
    takeRevenue: Math.round(w.inflows.takeRevenue * 0.85),
    subscriptions: Math.round(w.inflows.subscriptions * 0.7),
    other: w.inflows.other,
  },
}))

export const cashFlowScenarios: ScenarioData[] = [
  {
    id: 'bull',
    label: 'Bull Case',
    description: 'Optimistic scenario with accelerated growth',
    assumptions: [
      'Birmingham launch hits 65% liquidity by week 6',
      'Verified Plus adoption reaches 12% of owners',
      'Referral loop 2.0 increases viral coefficient to 0.7',
      'No major competitor enters Alabama market',
    ],
    weeks: bullWeeks,
  },
  {
    id: 'base',
    label: 'Base Case',
    description: 'Expected scenario based on current trajectory',
    assumptions: [
      'Birmingham launch hits 50% liquidity by week 8',
      'Verified Plus adoption reaches 8% of owners',
      'Referral improvements deliver 15% WAM boost',
      'Steady organic growth continues',
    ],
    weeks: baseWeeks,
  },
  {
    id: 'bear',
    label: 'Bear Case',
    description: 'Conservative scenario with headwinds',
    assumptions: [
      'Birmingham launch delayed 4 weeks due to vendor issues',
      'Verified Plus adoption below 5%',
      'Referral improvements underperform expectations',
      'Summer seasonality impacts kid engagement',
    ],
    weeks: bearWeeks,
  },
]

export const getScenarioById = (id: Scenario): ScenarioData | undefined => {
  return cashFlowScenarios.find((s) => s.id === id)
}

// Helper to calculate running balance
export const calculateRunningBalance = (
  weeks: CashFlowWeek[],
  startingCash: number
): number[] => {
  const balances: number[] = []
  let balance = startingCash

  for (const week of weeks) {
    const totalInflows =
      week.inflows.takeRevenue + week.inflows.subscriptions + week.inflows.other
    const totalOutflows =
      week.outflows.payroll +
      week.outflows.marketing +
      week.outflows.infrastructure +
      week.outflows.operations +
      week.outflows.other
    balance += totalInflows - totalOutflows
    balances.push(balance)
  }

  return balances
}

// Starting cash position
export const STARTING_CASH = 180000 // $180K runway from pre-seed
