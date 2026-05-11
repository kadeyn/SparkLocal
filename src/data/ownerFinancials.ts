// Owner P&L impact from SparkLocal — Marcus's small-business view of what the platform
// adds (and costs). Dollar figures are nominal, not in thousands.

export interface OwnerPLLine {
  id: string
  label: string
  category: 'revenue' | 'savings' | 'cost'
  monthly: number // dollars
  ytd: number // dollars
  note?: string
}

export interface OwnerKPI {
  id: string
  label: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'flat'
}

export interface OwnerRatio {
  id: string
  label: string
  value: string
  target: string
  status: 'good' | 'warning' | 'critical'
  description: string
}

export interface OwnerScenario {
  id: string
  label: string
  description: string
  monthlyNet: number
  payback: string
  highlight?: boolean
}

export const ownerKPIs: OwnerKPI[] = [
  { id: 'gigs', label: 'Gigs this month', value: '14', delta: '+3 vs Apr', trend: 'up' },
  { id: 'earned', label: 'Total via SparkLocal', value: '$6,920', delta: '+$1,840 MoM', trend: 'up' },
  { id: 'activeKids', label: 'Active kids', value: '2', delta: 'Carlos · Taylor', trend: 'flat' },
  { id: 'timeSaved', label: 'Time saved this mo.', value: '38 hrs', delta: '$1,140 @ $30/hr', trend: 'up' },
]

export const ownerPL: OwnerPLLine[] = [
  // Revenue lines
  {
    id: 'rev-residential',
    label: 'SparkLocal-sourced residential service revenue',
    category: 'revenue',
    monthly: 5400,
    ytd: 14820,
    note: '14 service calls @ avg $385',
  },
  {
    id: 'rev-social',
    label: 'Revenue from social/web work (Taylor)',
    category: 'revenue',
    monthly: 1520,
    ytd: 3100,
    note: '4 reels + Q&A landing page',
  },

  // Savings lines (time-saved + admin)
  {
    id: 'save-time',
    label: 'Time saved by delegating to apprentices',
    category: 'savings',
    monthly: 1140,
    ytd: 2860,
    note: '38 hrs/mo @ $30/hr opportunity cost',
  },
  {
    id: 'save-callouts',
    label: 'Reduced callouts from junior support',
    category: 'savings',
    monthly: 240,
    ytd: 720,
    note: 'Carlos resolving 60% of routine maintenance solo',
  },

  // Cost lines
  {
    id: 'cost-subscription',
    label: 'SparkLocal subscription',
    category: 'cost',
    monthly: 75,
    ytd: 600,
    note: 'Free tier — $0. Pricing here is illustrative if upgraded.',
  },
  {
    id: 'cost-apprentice-pay',
    label: 'Apprentice wages (Carlos + Taylor)',
    category: 'cost',
    monthly: 1860,
    ytd: 4620,
    note: 'Carlos $14/hr · Taylor $15/hr',
  },
  {
    id: 'cost-onboarding',
    label: 'Onboarding + training time',
    category: 'cost',
    monthly: 180,
    ytd: 540,
    note: '6 hrs my time @ $30/hr',
  },
]

export const ownerRatios: OwnerRatio[] = [
  {
    id: 'r-roi',
    label: 'Net benefit per kid hired',
    value: '$2,340',
    target: '$1,500+',
    status: 'good',
    description: 'Monthly margin after apprentice wages + onboarding cost.',
  },
  {
    id: 'r-payback',
    label: 'Subscription payback',
    value: '< 1 day',
    target: '< 7 days',
    status: 'good',
    description: 'How many days of SparkLocal revenue covers the monthly fee.',
  },
  {
    id: 'r-utilization',
    label: 'Apprentice utilization',
    value: '72%',
    target: '70%+',
    status: 'good',
    description: 'Hours apprentices were billable / scheduled hours.',
  },
  {
    id: 'r-leakage',
    label: 'Service call leakage',
    value: '6/wk',
    target: '0/wk',
    status: 'warning',
    description:
      'Calls turned away for lack of capacity — addressable by hiring a 2nd full-time tech.',
  },
]

export const ownerScenarios: OwnerScenario[] = [
  {
    id: 's-current',
    label: 'Current (Free tier, 2 apprentices)',
    description: 'Where things stand today.',
    monthlyNet: 6185,
    payback: 'Immediate',
  },
  {
    id: 's-verified-plus',
    label: 'Upgrade to Verified Plus ($49/mo)',
    description: 'Priority matching + featured placement. Projected to surface ~2 more candidates a month.',
    monthlyNet: 7460,
    payback: '< 2 days',
    highlight: true,
  },
  {
    id: 's-second-tech',
    label: 'Add 2nd full-time tech (Initiative #1)',
    description: 'Stop turning away weekend calls. Apprentices continue alongside.',
    monthlyNet: 10985,
    payback: '~60 days',
  },
  {
    id: 's-commercial',
    label: 'Add commercial contracts (Initiative #2)',
    description: 'Layer 3 small commercial maintenance agreements on top of residential.',
    monthlyNet: 17985,
    payback: '~90 days',
  },
]

export const DEMO_OWNER_FINANCE_AI = {
  summary:
    'Your SparkLocal P&L is comfortably positive — net $6,185/mo with sub-1-day payback on the subscription. The pressure point is capacity, not unit economics: 6 service calls per week turned away is leaving roughly $9K/mo on the table. The Verified Plus upgrade is a sensible next step; a second tech is the real growth lever.',
  concerns: [
    {
      area: 'Capacity',
      detail:
        'Service call leakage of 6/wk represents ~$9K/mo of foregone revenue — bigger than every other line item except residential service revenue itself.',
    },
    {
      area: 'Apprentice utilization',
      detail:
        'At 72% you’re right at target, but losing one apprentice slot drops you below 60% fast. Bench depth matters — keep Mia and Andre warm in Engaged.',
    },
  ],
  positives: [
    {
      area: 'ROI per kid',
      detail:
        '$2,340 net per kid is well above the $1,500 target. The unit economics of hiring through SparkLocal are working.',
    },
    {
      area: 'Time saved',
      detail:
        '38 hrs/mo recovered — that’s a full week of your time, which is the whole reason to delegate in the first place.',
    },
  ],
  actionItems: [
    'Upgrade to Verified Plus this billing cycle — payback is under 2 days.',
    'Move the second-tech hire from Planning into Pilot in Initiatives.',
    'Run a 1-week experiment where Carlos owns 2 residential calls solo to validate the curriculum.',
  ],
}
