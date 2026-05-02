// GMV and take rate data for the last 12 weeks
export interface GMVDataPoint {
  week: string
  gmv: number
  take: number
}

export const gmvData: GMVDataPoint[] = [
  { week: 'W1', gmv: 12400, take: 1488 },
  { week: 'W2', gmv: 14200, take: 1704 },
  { week: 'W3', gmv: 13800, take: 1656 },
  { week: 'W4', gmv: 16500, take: 1980 },
  { week: 'W5', gmv: 18200, take: 2184 },
  { week: 'W6', gmv: 17100, take: 2052 },
  { week: 'W7', gmv: 19800, take: 2376 },
  { week: 'W8', gmv: 21400, take: 2568 },
  { week: 'W9', gmv: 23100, take: 2772 },
  { week: 'W10', gmv: 22600, take: 2712 },
  { week: 'W11', gmv: 25800, take: 3096 },
  { week: 'W12', gmv: 28200, take: 3384 },
]

// Cohort retention data
export interface RetentionDataPoint {
  week: number
  kids: number
  owners: number
  parents: number
}

export const cohortRetention: RetentionDataPoint[] = [
  { week: 0, kids: 100, owners: 100, parents: 100 },
  { week: 1, kids: 82, owners: 91, parents: 95 },
  { week: 2, kids: 71, owners: 84, parents: 89 },
  { week: 4, kids: 58, owners: 76, parents: 82 },
  { week: 8, kids: 44, owners: 62, parents: 78 },
  { week: 12, kids: 38, owners: 54, parents: 75 },
]

// Liquidity by metro
export interface MetroLiquidity {
  metro: string
  liquidity: number
  kids: number
  owners: number
  trend: 'up' | 'down' | 'stable'
}

export const liquidityByMetro: MetroLiquidity[] = [
  { metro: 'Mobile, AL', liquidity: 78, kids: 142, owners: 23, trend: 'up' },
  { metro: 'Birmingham, AL', liquidity: 65, kids: 98, owners: 18, trend: 'up' },
  { metro: 'Montgomery, AL', liquidity: 52, kids: 67, owners: 11, trend: 'stable' },
  { metro: 'Huntsville, AL', liquidity: 71, kids: 89, owners: 16, trend: 'up' },
  { metro: 'Tuscaloosa, AL', liquidity: 44, kids: 45, owners: 8, trend: 'down' },
]

// KPI data
export interface KPIData {
  id: string
  label: string
  value: string
  change: number
  changeLabel: string
  trend: 'up' | 'down' | 'stable'
}

export const kpiData: KPIData[] = [
  {
    id: 'wam',
    label: 'Weekly Active Matches',
    value: '847',
    change: 12.4,
    changeLabel: 'vs last week',
    trend: 'up',
  },
  {
    id: 'gmv',
    label: 'GMV (This Week)',
    value: '$28.2K',
    change: 9.3,
    changeLabel: 'vs last week',
    trend: 'up',
  },
  {
    id: 'take',
    label: 'Take (This Week)',
    value: '$3,384',
    change: 9.3,
    changeLabel: 'vs last week',
    trend: 'up',
  },
  {
    id: 'liquidity',
    label: 'Avg Liquidity',
    value: '62%',
    change: 4.1,
    changeLabel: 'vs last week',
    trend: 'up',
  },
  {
    id: 'kids',
    label: 'Active Kids',
    value: '441',
    change: 8.7,
    changeLabel: 'vs last week',
    trend: 'up',
  },
  {
    id: 'owners',
    label: 'Active Owners',
    value: '76',
    change: 5.2,
    changeLabel: 'vs last week',
    trend: 'up',
  },
]

// Demo mode mock responses
export const DEMO_BRIEFING_RESPONSE = {
  headline: "412 kids in 'interested' limbo cost ~$8.4K weekly GMV",
  explanation:
    "36% of kids who tap 'I'm interested' never convert because parents don't approve within 48 hours. The drop is concentrated weekday evenings 7-10pm — when parents are off work but distracted. 62% of these parents do open the notification but abandon the flow before approving.",
  stats: [
    { label: 'Stalled approvals', value: '412' },
    { label: 'Weekly GMV at risk', value: '$8.4K' },
    { label: 'Parent open rate', value: '62%' },
  ],
  actions: [
    { label: 'Add SMS reminder at 24hr mark', impact: '+$3.2K/wk' },
    { label: 'Simplify approval to one tap', impact: '+$2.1K/wk' },
    { label: 'Show parent pre-approved bundles', impact: '+$1.8K/wk' },
  ],
}

export const DEMO_INSIGHT_RESPONSES: Record<string, string> = {
  gmv: 'GMV growth is accelerating — up 9.3% this week vs 8.1% last week. The uptick correlates with the new "quick apply" button we shipped. Mobile, AL remains the strongest metro at 34% of total GMV.',
  liquidity:
    'Tuscaloosa liquidity dropped to 44% — below our 50% threshold. Root cause: 3 high-volume owners went inactive (summer break). Recommend seeding 2-3 new owners via the referral program.',
  retention:
    'Kid retention at week 4 (58%) is tracking above benchmark (target: 55%). The skill tree gamification is working — kids with 2+ badges retain at 71%. Consider making first badge easier to earn.',
}

export const DEMO_PITCH_RESPONSE = {
  audience: 'owner',
  opening:
    "Marcus, I noticed Thompson Auto Repair has been serving Mobile for 15 years — that's incredible community roots. I'm reaching out because we've built something that could help you find motivated young helpers while giving back to local kids.",
  problem:
    "Finding reliable part-time help is tough. Traditional job boards attract adults looking for full-time work, and hiring teens feels risky without proper vetting. Meanwhile, there are tons of local kids who'd love to learn about cars and earn money — they just can't find you.",
  solution:
    "SparkLocal is a marketplace that connects verified local businesses like yours with pre-screened students ages 14-18. Every kid comes with parent approval, background-checked guardians, and a profile showing their skills and interests. You post gigs (social media help, shop organization, customer greeting) and matched kids apply. If they're not a fit, no obligation.",
  proof:
    'We launched in Mobile 3 months ago. Devon at FreshCuts Barbershop has hired 4 kids through us — his booking system project got done in a weekend for $60. Lina at Blossom Bakery says her student photographer paid for herself in a single Instagram campaign.',
  ask: "Would you be open to a 10-minute call this week? I'd love to learn more about your shop and see if SparkLocal could help. No pressure — even if it's not a fit, I'll share what we're seeing work for other auto shops.",
  signoff:
    "Thanks for your time, Marcus. Looking forward to connecting.\n\nBest,\n[Your name]\nSparkLocal · Connecting local businesses with young talent",
}
