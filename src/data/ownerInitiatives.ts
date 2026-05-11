// Owner operational initiatives — what Marcus is actually trying to ship at his shop.
// Mirrors the operator initiative shape so the kanban + deep dive components can be reused
// conceptually without sharing imports.

export type OwnerInitiativeStage = 'idea' | 'planning' | 'pilot' | 'scaling'
export type OwnerInitiativeHealth = 'on-track' | 'at-risk' | 'blocked'

export interface OwnerInitiativeKPI {
  label: string
  target: string
  current: string
  trend: 'up' | 'down' | 'flat'
}

export interface OwnerInitiative {
  id: string
  title: string
  description: string
  stage: OwnerInitiativeStage
  health: OwnerInitiativeHealth
  startDate: string
  targetDate: string
  kpis: OwnerInitiativeKPI[]
  blockers: string[]
  nextSteps: string[]
  estImpact: string // human-readable revenue / cost-savings projection
}

export const OWNER_STAGE_COLORS: Record<OwnerInitiativeStage, string> = {
  idea: '#94a3b8',
  planning: '#7B61FF',
  pilot: '#FFA94D',
  scaling: '#22C8A9',
}

export const OWNER_HEALTH_COLORS: Record<OwnerInitiativeHealth, string> = {
  'on-track': '#22C8A9',
  'at-risk': '#FFA94D',
  'blocked': '#F97362',
}

export const ownerInitiatives: OwnerInitiative[] = [
  {
    id: 'oin-1',
    title: 'Hire a second full-time tech',
    description:
      'Move from 1 tech (me) + 2 apprentices to 2 full-time techs. Goal: stop turning away weekend service calls in Mobile metro.',
    stage: 'planning',
    health: 'on-track',
    startDate: '2026-04-01',
    targetDate: '2026-09-30',
    kpis: [
      { label: 'Candidates interviewed', target: '5', current: '2', trend: 'up' },
      { label: 'Service calls turned away / wk', target: '0', current: '6', trend: 'flat' },
      { label: 'Cash runway covering 2nd salary', target: '90 days', current: '60 days', trend: 'up' },
    ],
    blockers: [],
    nextSteps: [
      'Post lead-tech role to local HVAC trade school',
      'Sign up Carlos for ride-along week so I can scope a real handoff',
      'Run a 4-week revenue projection assuming +1 tech',
    ],
    estImpact: '+$4,800/mo gross once ramped',
  },
  {
    id: 'oin-2',
    title: 'Expand to commercial HVAC contracts',
    description:
      'Add commercial accounts (restaurants, small retail) alongside residential. Higher ticket size, recurring maintenance.',
    stage: 'idea',
    health: 'on-track',
    startDate: '2026-05-01',
    targetDate: '2026-11-30',
    kpis: [
      { label: 'Commercial leads in pipeline', target: '10', current: '0', trend: 'flat' },
      { label: 'Avg ticket (commercial)', target: '$1,800', current: '—', trend: 'flat' },
      { label: 'Service agreements signed', target: '3', current: '0', trend: 'flat' },
    ],
    blockers: [],
    nextSteps: [
      'Talk to insurance agent about commercial coverage delta',
      'Visit 3 restaurants on Government St for cold intros',
      'Draft commercial maintenance agreement template',
    ],
    estImpact: '+$11,000/mo at 3 contracts',
  },
  {
    id: 'oin-3',
    title: 'Train Carlos on diagnostic equipment',
    description:
      'Get Carlos certified on refrigerant recovery + manifold gauge usage so he can run simple service calls solo by end of summer.',
    stage: 'pilot',
    health: 'on-track',
    startDate: '2026-04-15',
    targetDate: '2026-08-15',
    kpis: [
      { label: 'Cert hours completed', target: '40', current: '22', trend: 'up' },
      { label: 'Supervised calls passed', target: '15', current: '7', trend: 'up' },
      { label: 'Solo calls (target)', target: '5/wk', current: '0/wk', trend: 'flat' },
    ],
    blockers: [],
    nextSteps: [
      'Schedule EPA 608 prep sessions Tues evenings',
      'Pair Carlos on next 5 maintenance calls before letting him run one',
      'Buy second set of manifold gauges so we can split jobs',
    ],
    estImpact: 'Frees 8 hrs/wk of my time',
  },
  {
    id: 'oin-4',
    title: 'Build review pipeline — 20 five-star Google reviews',
    description:
      'Get to 20 verified 5-star Google reviews to outrank Cool Breeze AC in search. Currently sitting at 7 reviews.',
    stage: 'pilot',
    health: 'at-risk',
    startDate: '2026-03-01',
    targetDate: '2026-07-31',
    kpis: [
      { label: 'Google reviews (5★)', target: '20', current: '7', trend: 'up' },
      { label: 'Reviews per completed job', target: '40%', current: '12%', trend: 'flat' },
      { label: 'Search ranking (Mobile)', target: '#3', current: '#7', trend: 'flat' },
    ],
    blockers: [
      'No automated text-after-completion — relying on memory',
      'No QR code card to leave with customers',
    ],
    nextSteps: [
      'Set up Jobber follow-up text on completion',
      'Print QR-to-Google-review cards for the truck',
      'Personally text the last 12 customers',
    ],
    estImpact: '+15-25% inbound calls',
  },
  {
    id: 'oin-5',
    title: '30-day onboarding curriculum for new kid hires',
    description:
      'Codify the first 30 days for a new SparkLocal apprentice — what they shadow week 1, what they touch week 2, what they own week 4.',
    stage: 'planning',
    health: 'on-track',
    startDate: '2026-05-01',
    targetDate: '2026-06-30',
    kpis: [
      { label: 'Curriculum sections drafted', target: '4', current: '1', trend: 'up' },
      { label: 'Time-to-first-solo-call', target: '21 days', current: '45 days', trend: 'flat' },
      { label: 'Apprentices completing 30d', target: '90%', current: '67%', trend: 'up' },
    ],
    blockers: [],
    nextSteps: [
      'Write week 1: ride-along checklist (10 items)',
      'Record short Loom of a typical residential install',
      'Talk to other SparkLocal HVAC owners about their first-30 playbook',
    ],
    estImpact: 'Halves my training overhead',
  },
  {
    id: 'oin-6',
    title: 'Switch from spreadsheet scheduling to Jobber',
    description:
      'Replace the Google Sheet I use for service scheduling with Jobber so the apprentices can self-check their next assignment.',
    stage: 'scaling',
    health: 'on-track',
    startDate: '2026-03-20',
    targetDate: '2026-05-31',
    kpis: [
      { label: 'Team members onboarded', target: '4', current: '4', trend: 'up' },
      { label: 'Calls scheduled in Jobber', target: '100%', current: '92%', trend: 'up' },
      { label: 'Avg "where am I going?" texts', target: '0/day', current: '1/day', trend: 'down' },
    ],
    blockers: [],
    nextSteps: [
      'Final spreadsheet cutover this Friday',
      'Train Taylor on customer detail entry',
      'Cancel the Excel mobile sub I’m paying for',
    ],
    estImpact: 'Saves 3 hrs/wk in admin',
  },
]

export const getOwnerInitiativesByStage = (
  stage: OwnerInitiativeStage,
): OwnerInitiative[] => {
  return ownerInitiatives.filter((i) => i.stage === stage)
}

export const getOwnerInitiativeById = (id: string): OwnerInitiative | undefined => {
  return ownerInitiatives.find((i) => i.id === id)
}
