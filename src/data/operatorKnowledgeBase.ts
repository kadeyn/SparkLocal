export interface KnowledgeEntry {
  id: string
  category: string
  title: string
  content: string
  tags: string[]
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: 'kb-1',
    category: 'Growth Strategy',
    title: 'Owner-First Market Entry',
    content:
      'SparkLocal uses an owner-first market entry strategy. We onboard local business owners before kids to ensure supply exists when demand arrives. Target: 15+ verified owners per metro before launching kid acquisition. This creates immediate liquidity and reduces "empty marketplace" churn.',
    tags: ['growth', 'marketplace', 'supply-side', 'launch'],
  },
  {
    id: 'kb-2',
    category: 'Growth Strategy',
    title: 'Geographic Density Model',
    content:
      'We expand metro-by-metro, not nationally. Goal is 85%+ kid-owner match rate within 3 miles. Sparse coverage kills conversion. We use school district boundaries as expansion units — when one district hits 50 kids, we seed adjacent districts.',
    tags: ['growth', 'geographic', 'density', 'expansion'],
  },
  {
    id: 'kb-3',
    category: 'Growth Strategy',
    title: 'Referral Loop Architecture',
    content:
      'Three-way referral loops: (1) Owners refer other owners for marketplace depth, (2) Parents refer parents through school networks, (3) Kids refer kids for social proof. Each loop has distinct incentives — owners get priority placement, parents get safety credits, kids get XP boosts.',
    tags: ['growth', 'referrals', 'viral', 'incentives'],
  },
  {
    id: 'kb-4',
    category: 'Product',
    title: 'Parent Approval Flow',
    content:
      'Every opportunity requires explicit parent approval before a kid can engage. The approval flow is mobile-first, designed to complete in under 30 seconds. Parents see: business verification status, expected hours, pay range, and safety ratings. Approval rate benchmark: 72%.',
    tags: ['product', 'safety', 'parents', 'approval'],
  },
  {
    id: 'kb-5',
    category: 'Product',
    title: 'Trust & Safety Framework',
    content:
      'Four-layer safety: (1) Owner background checks via Checkr, (2) Real-time location sharing during gigs, (3) In-app messaging only (no personal contact exchange), (4) Post-gig ratings from both sides. Zero-tolerance policy for safety violations — immediate permanent ban.',
    tags: ['product', 'safety', 'trust', 'verification'],
  },
  {
    id: 'kb-6',
    category: 'Product',
    title: 'Skill Tree Progression',
    content:
      'Kids progress through a skill tree with 13 nodes across 5 tiers. Start → Foundation skills → Applied skills → Advanced → Mastery. Each node unlocks via real-world accomplishments (completing gigs, earning repeat clients, hitting earnings milestones). XP accumulates and displays on profiles.',
    tags: ['product', 'gamification', 'progression', 'engagement'],
  },
  {
    id: 'kb-7',
    category: 'Revenue',
    title: 'Take Rate Model',
    content:
      'SparkLocal charges a 12% take rate on completed transactions. Split: 8% from owner payment, 4% from kid earnings. This maintains kid earnings visibility (they see gross, we take from net). Owners see "SparkLocal fee" as line item. No subscription fees for either side.',
    tags: ['revenue', 'pricing', 'take-rate', 'monetization'],
  },
  {
    id: 'kb-8',
    category: 'Revenue',
    title: 'Premium Owner Tiers',
    content:
      'Future revenue stream: Premium owner subscriptions. $49/mo for "Verified Plus" (priority matching, featured placement, advanced analytics). $149/mo for "Enterprise" (multi-location, API access, dedicated support). Not launched yet — focus is GMV growth first.',
    tags: ['revenue', 'premium', 'subscriptions', 'future'],
  },
  {
    id: 'kb-9',
    category: 'Metrics',
    title: 'North Star Metric',
    content:
      'North Star: Weekly Active Matches (WAM) — the count of unique kid-owner pairs that complete at least one transaction per week. WAM directly correlates with GMV and indicates marketplace health. Target: 15% week-over-week WAM growth during scaling phase.',
    tags: ['metrics', 'north-star', 'growth', 'tracking'],
  },
  {
    id: 'kb-10',
    category: 'Metrics',
    title: 'Liquidity Score',
    content:
      'Liquidity score per metro: (matched opportunities / total posted opportunities) × 100. Target: 65%+ liquidity. Below 50% indicates supply-demand imbalance — either too many kids or too few owners. Dashboard shows real-time liquidity by metro.',
    tags: ['metrics', 'liquidity', 'marketplace', 'health'],
  },
  {
    id: 'kb-11',
    category: 'Metrics',
    title: 'Cohort Retention Benchmarks',
    content:
      'Target retention by cohort: Kids: 60% at week 4, 40% at week 12. Owners: 75% at week 4, 55% at week 12. Parents: 80% at week 4 (passive retention — they mostly just approve). Drop below these benchmarks triggers intervention playbooks.',
    tags: ['metrics', 'retention', 'cohorts', 'benchmarks'],
  },
  {
    id: 'kb-12',
    category: 'Operations',
    title: 'Owner Onboarding SLA',
    content:
      'Owner onboarding SLA: Application to verified in under 48 hours. Steps: (1) Basic info submission, (2) Background check initiation (24hr), (3) Video call verification (optional fast-track), (4) First opportunity post. Bottleneck is usually background check turnaround.',
    tags: ['operations', 'onboarding', 'owners', 'sla'],
  },
  {
    id: 'kb-13',
    category: 'Operations',
    title: 'Support Escalation Tiers',
    content:
      'Tier 1: Automated (FAQ bot, help center). Tier 2: Human support (email, 24hr response). Tier 3: Safety team (immediate for safety concerns). Tier 4: Founder escalation (VIP owners, press, legal). 90% of tickets resolve at Tier 1-2.',
    tags: ['operations', 'support', 'escalation', 'customer-service'],
  },
  {
    id: 'kb-14',
    category: 'Competition',
    title: 'Competitive Landscape',
    content:
      'Direct competitors: None at scale for youth gig marketplace. Adjacent: Nextdoor (local but not youth-focused), TaskRabbit (gigs but 18+), Outschool (youth but education). Our moat: Trust infrastructure specifically built for under-18 workers with parental oversight.',
    tags: ['competition', 'market', 'positioning', 'moat'],
  },
  {
    id: 'kb-15',
    category: 'Competition',
    title: 'Defensibility Thesis',
    content:
      'Three moats: (1) Network effects — more owners attract more kids attract more owners, (2) Trust/safety infrastructure — expensive to replicate the background check + parental approval system, (3) Local density — once we own a metro, switching costs are high for all sides.',
    tags: ['competition', 'defensibility', 'moats', 'strategy'],
  },
  {
    id: 'kb-16',
    category: 'Fundraising',
    title: 'Funding History',
    content:
      'Pre-seed: $500K from angel investors (Q1 2024). Focus: MVP build, initial metro launch. Seed round target: $2.5M at $12M post-money. Use of funds: 60% engineering, 25% go-to-market, 15% operations. Timeline: Close by Q3 2024.',
    tags: ['fundraising', 'capital', 'investors', 'seed'],
  },
  {
    id: 'kb-17',
    category: 'Fundraising',
    title: 'Investor Pitch Angles',
    content:
      'Lead with: (1) $380B youth spending power, (2) 73% of teens want to earn money, (3) Parents desperate for structured activities. Counter objections: Safety is solved with our trust framework. Regulatory is handled with parental consent + age-appropriate work limits.',
    tags: ['fundraising', 'pitch', 'investors', 'messaging'],
  },
  {
    id: 'kb-18',
    category: 'Team',
    title: 'Hiring Priorities',
    content:
      'Current hiring: (1) Senior full-stack engineer — React + Supabase, (2) Growth marketer — B2C2B experience, (3) Trust & Safety lead — background in youth platforms. All roles remote-first, US timezone overlap required.',
    tags: ['team', 'hiring', 'roles', 'recruiting'],
  },
  {
    id: 'kb-19',
    category: 'Team',
    title: 'Culture Principles',
    content:
      'Four principles: (1) Kids first — every decision filters through "does this help kids succeed?", (2) Local love — we celebrate the communities we serve, (3) Trust is sacred — we never compromise on safety, (4) Ship fast, learn faster — bias toward action with rapid iteration.',
    tags: ['team', 'culture', 'values', 'principles'],
  },
  {
    id: 'kb-20',
    category: 'Legal',
    title: 'Youth Employment Compliance',
    content:
      'Federal: FLSA permits 14+ for non-hazardous work, limited hours during school. State: We geo-fence by state labor laws. Key restrictions: No work during school hours, max 3 hours on school days, max 18 hours during school weeks. All gigs are structured as independent contractor arrangements under parental supervision.',
    tags: ['legal', 'compliance', 'labor', 'regulations'],
  },
  {
    id: 'kb-21',
    category: 'Legal',
    title: 'Data Privacy for Minors',
    content:
      'COPPA compliance: Parental consent required for users under 13. We collect minimal PII, no behavioral advertising, no data sales. Parents can request full data deletion. Privacy policy written in plain language at 6th grade reading level.',
    tags: ['legal', 'privacy', 'coppa', 'data'],
  },
]

export const getKnowledgeByCategory = (category: string): KnowledgeEntry[] => {
  return KNOWLEDGE_BASE.filter((entry) => entry.category === category)
}

export const searchKnowledge = (query: string): KnowledgeEntry[] => {
  const lowerQuery = query.toLowerCase()
  return KNOWLEDGE_BASE.filter(
    (entry) =>
      entry.title.toLowerCase().includes(lowerQuery) ||
      entry.content.toLowerCase().includes(lowerQuery) ||
      entry.tags.some((tag) => tag.includes(lowerQuery))
  )
}

export const getKnowledgeCategories = (): string[] => {
  return [...new Set(KNOWLEDGE_BASE.map((entry) => entry.category))]
}
