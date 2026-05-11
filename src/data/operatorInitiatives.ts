// Initiative Pipeline - Kanban with KPI tracking

export type InitiativeStage = 'idea' | 'planning' | 'pilot' | 'scaling' | 'completed'
export type InitiativeHealth = 'on-track' | 'at-risk' | 'blocked'

export interface InitiativeKPI {
  label: string
  target: string
  current: string
  trend: 'up' | 'down' | 'flat'
}

export interface Initiative {
  id: string
  title: string
  description: string
  stage: InitiativeStage
  health: InitiativeHealth
  owner: string
  startDate: string
  targetDate: string
  kpis: InitiativeKPI[]
  blockers: string[]
  nextSteps: string[]
  vectorId?: string // Links to roadmap vector
}

export const STAGE_COLORS: Record<InitiativeStage, string> = {
  idea: '#94a3b8',
  planning: '#7B61FF',
  pilot: '#FFA94D',
  scaling: '#22C8A9',
  completed: '#10B981',
}

export const HEALTH_COLORS: Record<InitiativeHealth, string> = {
  'on-track': '#22C8A9',
  'at-risk': '#FFA94D',
  'blocked': '#F97362',
}

export const initiatives: Initiative[] = [
  {
    id: 'init-1',
    title: 'Referral Loop 2.0',
    description: 'Upgrade the three-way referral system with gamified incentives, leaderboards, and tiered rewards. Goal: increase viral coefficient from 0.3 to 0.6.',
    stage: 'pilot',
    health: 'on-track',
    owner: 'Sarah Chen',
    startDate: '2024-01-15',
    targetDate: '2024-04-30',
    kpis: [
      { label: 'Viral coefficient', target: '0.6', current: '0.45', trend: 'up' },
      { label: 'Referral conversion', target: '25%', current: '18%', trend: 'up' },
      { label: 'CAC payback', target: '45 days', current: '52 days', trend: 'down' },
    ],
    blockers: [],
    nextSteps: [
      'A/B test leaderboard visibility',
      'Launch streak bonus feature',
      'Partner integration for reward fulfillment',
    ],
    vectorId: 'org-1',
  },
  {
    id: 'init-2',
    title: 'Birmingham Metro Launch',
    description: 'Full market launch in Birmingham, AL. Pre-seed 20 owners, hit 50% liquidity within 6 weeks.',
    stage: 'scaling',
    health: 'at-risk',
    owner: 'Marcus Johnson',
    startDate: '2024-02-01',
    targetDate: '2024-05-15',
    kpis: [
      { label: 'Active owners', target: '25', current: '18', trend: 'up' },
      { label: 'Active kids', target: '150', current: '89', trend: 'up' },
      { label: 'Liquidity', target: '50%', current: '38%', trend: 'flat' },
    ],
    blockers: [
      'Background check vendor delays in Jefferson County',
      'School district partnership stalled pending board approval',
    ],
    nextSteps: [
      'Escalate vendor issue to Checkr account manager',
      'Schedule follow-up with Birmingham City Schools superintendent',
      'Launch owner referral incentive program',
    ],
    vectorId: 'roll-1',
  },
  {
    id: 'init-3',
    title: 'Verified Plus Tier',
    description: 'Launch premium owner subscription at $49/mo with priority matching and advanced analytics.',
    stage: 'pilot',
    health: 'on-track',
    owner: 'Alex Rivera',
    startDate: '2024-02-15',
    targetDate: '2024-04-15',
    kpis: [
      { label: 'Pilot signups', target: '15', current: '12', trend: 'up' },
      { label: 'Feature usage', target: '70%', current: '65%', trend: 'up' },
      { label: 'Upgrade conversion', target: '8%', current: '6%', trend: 'up' },
    ],
    blockers: [],
    nextSteps: [
      'User interviews with pilot participants',
      'Pricing sensitivity analysis',
      'Build analytics dashboard V1',
    ],
    vectorId: 'bolt-2',
  },
  {
    id: 'init-4',
    title: 'Self-Serve Owner Onboarding',
    description: 'Auto-approve low-risk owners based on business signals. Eliminate manual verification calls for 60% of applicants.',
    stage: 'planning',
    health: 'on-track',
    owner: 'Jordan Lee',
    startDate: '2024-03-01',
    targetDate: '2024-06-30',
    kpis: [
      { label: 'Auto-approval rate', target: '60%', current: '0%', trend: 'flat' },
      { label: 'Fraud rate', target: '<0.5%', current: '0.3%', trend: 'flat' },
      { label: 'Time to first gig', target: '24hr', current: '72hr', trend: 'flat' },
    ],
    blockers: [],
    nextSteps: [
      'Define risk scoring model with Trust & Safety',
      'Legal review of auto-approval flow',
      'Technical spec for background check integration',
    ],
    vectorId: 'marg-2',
  },
  {
    id: 'init-5',
    title: 'School District Partnerships',
    description: 'Partner with school districts to embed SparkLocal in career readiness programs. Target: 3 district MOUs by Q3.',
    stage: 'idea',
    health: 'on-track',
    owner: 'Emily Watson',
    startDate: '2024-03-15',
    targetDate: '2024-09-30',
    kpis: [
      { label: 'Districts contacted', target: '20', current: '5', trend: 'up' },
      { label: 'MOUs signed', target: '3', current: '0', trend: 'flat' },
      { label: 'Students reached', target: '5000', current: '0', trend: 'flat' },
    ],
    blockers: [],
    nextSteps: [
      'Research district procurement processes',
      'Develop pitch deck for superintendents',
      'Identify champion contacts at target districts',
    ],
    vectorId: 'org-2',
  },
  {
    id: 'init-6',
    title: 'Privacy counsel engagement — COPPA amended rule readiness',
    description:
      'P0 · $25K budget. Engage outside privacy counsel to audit our COPPA amended rule readiness, draft the separate-consent flow language, and review the data retention policy before V1 launch. Critical-path compliance work — amended rule in force 2026-04-22.',
    stage: 'planning',
    health: 'on-track',
    owner: 'Zac Smith',
    startDate: '2026-05-01',
    targetDate: '2026-07-15',
    kpis: [
      { label: 'Outside counsel scoped', target: '1 firm', current: '0', trend: 'flat' },
      { label: 'Compliance memos delivered', target: '3', current: '0', trend: 'flat' },
      { label: 'Privacy policy v2 shipped', target: 'Yes', current: 'No', trend: 'flat' },
    ],
    blockers: [],
    nextSteps: [
      'Interview 3 privacy firms with EdTech / under-18 experience',
      'Sign engagement letter with chosen firm',
      'Schedule retention-policy review session',
    ],
  },
  {
    id: 'init-7',
    title: 'Money transmitter law review — parent-mediated payment architecture',
    description:
      'P0 · $10K budget. Legal review of state money transmitter laws to confirm the parent-mediated payment architecture (kid earnings flow to a parent-controlled account) avoids triggering MTL licensure in our launch states. Blocks the prompt-2 payment work.',
    stage: 'planning',
    health: 'on-track',
    owner: 'Zac Smith',
    startDate: '2026-05-01',
    targetDate: '2026-08-01',
    kpis: [
      { label: 'Launch states reviewed', target: '5', current: '0', trend: 'flat' },
      { label: 'MTL exposure memo', target: 'Yes', current: 'No', trend: 'flat' },
      { label: 'Payment-flow architecture approved', target: 'Yes', current: 'No', trend: 'flat' },
    ],
    blockers: [
      'Parent-mediated payments (prompt 2) cannot ship until this clears',
    ],
    nextSteps: [
      'Brief external counsel on the parent-mediated flow design',
      'Confirm Alabama, Mississippi, Florida, Georgia, Tennessee positions',
      'Document any state-specific caveats for engineering',
    ],
  },
  {
    id: 'init-10',
    title: 'Feed redesign + Path tab restructure — V1',
    description:
      'P0 · $0 internal · shipped 2026-05-11. Bounded daily feed (5-8 swipe cards, 200ms cooldown, exhausted state, session pacing hook). Path tab restructured: Skill Tree + Future collapsed into My Path; Constellation renamed to Explore. Anti-doomscroll mechanics per research brief §7.',
    stage: 'completed',
    health: 'on-track',
    owner: 'Zac Smith',
    startDate: '2026-05-04',
    targetDate: '2026-05-11',
    kpis: [
      { label: 'Daily-bounded swipe UI', target: 'Yes', current: 'Yes', trend: 'flat' },
      { label: 'Path tabs (was 3)', target: '2', current: '2', trend: 'flat' },
      { label: 'Open Badges → My Path wired', target: 'Yes', current: 'Yes', trend: 'flat' },
    ],
    blockers: [],
    nextSteps: [
      'Wire AI-aware session pacing once prompt 5 ships the cost router',
      'Replace mock card generator with real recommender after backend lands',
      'Delete legacy SkillTree/Constellation/Future after one release cycle',
    ],
  },
  {
    id: 'init-9',
    title: 'Open Badges 3.0 credential issuer — V1',
    description:
      'P0 · $0 internal · shipped 2026-05-11. W3C VC Data Model v2.0 + Open Badges 3.0 issuer with mentor-proposes / kid-accepts flow. Ed25519Signature2020 over an env-var key (KMS-ready abstraction). Hardening punch list lives in README §10.',
    stage: 'completed',
    health: 'on-track',
    owner: 'Zac Smith',
    startDate: '2026-05-01',
    targetDate: '2026-05-15',
    kpis: [
      { label: 'Badge classes shipped', target: '5+', current: '7', trend: 'up' },
      { label: 'Issuer DID generated', target: 'Yes', current: 'Yes', trend: 'flat' },
      { label: 'Kid-accept flow shipped', target: 'Yes', current: 'Yes', trend: 'flat' },
    ],
    blockers: [],
    nextSteps: [
      'Hand-cache the Open Badges 3.0 context for production-grade verification',
      'Move private signing key out of env var to KMS / Vault before V1 launch',
      'Add StatusList2021 for revocation (hardening pass)',
    ],
  },
  {
    id: 'init-8',
    title: 'Developmental psychology consultation for track design',
    description:
      'P1 · $5K budget. Bring in a developmental psychologist to review the Explorer/Builder/Pro track boundaries, money-handling progression, and parental-veto framework — independent expert review before user testing.',
    stage: 'planning',
    health: 'on-track',
    owner: 'Zac Smith',
    startDate: '2026-05-01',
    targetDate: '2026-06-15',
    kpis: [
      { label: 'Consultant scoped', target: '1', current: '0', trend: 'flat' },
      { label: 'Track-boundary review delivered', target: 'Yes', current: 'No', trend: 'flat' },
      { label: 'Recommendations integrated', target: 'Yes', current: 'No', trend: 'flat' },
    ],
    blockers: [],
    nextSteps: [
      'Identify 2-3 candidates with adolescent-finance research background',
      'Send the track-spec doc for pre-meeting review',
      'Run a 60-min working session on age-13 cognitive readiness',
    ],
  },
]

export const getInitiativesByStage = (stage: InitiativeStage): Initiative[] => {
  return initiatives.filter((i) => i.stage === stage)
}

export const getInitiativeById = (id: string): Initiative | undefined => {
  return initiatives.find((i) => i.id === id)
}
