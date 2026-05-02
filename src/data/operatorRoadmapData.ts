// Growth Roadmap - 4 strategic vectors with their plays

export type VectorType = 'organic' | 'rollup' | 'boltOn' | 'margin'

export interface Play {
  id: string
  title: string
  description: string
  impact: string
  effort: 'Low' | 'Medium' | 'High'
  timeline: string
  kpis: string[]
  status: 'Not Started' | 'In Progress' | 'Completed'
}

export interface Vector {
  id: VectorType
  label: string
  color: string
  description: string
  plays: Play[]
}

export const VECTOR_COLORS: Record<VectorType, string> = {
  organic: '#22C8A9',
  rollup: '#7B61FF',
  boltOn: '#FFA94D',
  margin: '#F97362',
}

export const roadmapVectors: Vector[] = [
  {
    id: 'organic',
    label: 'Organic Growth',
    color: VECTOR_COLORS.organic,
    description: 'Expand within existing markets through product and go-to-market improvements',
    plays: [
      {
        id: 'org-1',
        title: 'Referral Loop 2.0',
        description: 'Upgrade the three-way referral system with gamified incentives and social proof mechanics. Add leaderboard, streak bonuses, and tiered rewards.',
        impact: '+15% WAM growth',
        effort: 'Medium',
        timeline: 'Q2 2024',
        kpis: ['Referral conversion rate', 'Viral coefficient', 'CAC payback'],
        status: 'In Progress',
      },
      {
        id: 'org-2',
        title: 'School District Partnerships',
        description: 'Partner with school districts to embed SparkLocal in career readiness programs. Unlock bulk onboarding and institutional trust.',
        impact: '+3 metros/quarter',
        effort: 'High',
        timeline: 'Q3 2024',
        kpis: ['Districts signed', 'Students onboarded', 'District retention'],
        status: 'Not Started',
      },
      {
        id: 'org-3',
        title: 'Skill Tree Expansion',
        description: 'Add 8 new skill nodes focused on digital skills (content creation, basic coding, design). Increase engagement ceiling.',
        impact: '+12% kid retention',
        effort: 'Medium',
        timeline: 'Q2 2024',
        kpis: ['Nodes unlocked', 'Time in app', 'Badge completion rate'],
        status: 'In Progress',
      },
      {
        id: 'org-4',
        title: 'Parent Dashboard V2',
        description: 'Add earnings insights, safety reports, and college-ready portfolio export. Convert passive approvers into engaged advocates.',
        impact: '+8% parent retention',
        effort: 'Low',
        timeline: 'Q2 2024',
        kpis: ['Dashboard DAU', 'Feature adoption', 'NPS'],
        status: 'Completed',
      },
    ],
  },
  {
    id: 'rollup',
    label: 'Metro Rollup',
    color: VECTOR_COLORS.rollup,
    description: 'Systematic expansion into new metros with proven playbook',
    plays: [
      {
        id: 'roll-1',
        title: 'Birmingham Launch',
        description: 'Launch Birmingham, AL with 20 pre-seeded owners. Use Mobile learnings for faster ramp.',
        impact: '+$40K GMV/quarter',
        effort: 'High',
        timeline: 'Q2 2024',
        kpis: ['Owner signups', 'Kid signups', 'Time to liquidity'],
        status: 'In Progress',
      },
      {
        id: 'roll-2',
        title: 'Huntsville Expansion',
        description: 'Leverage Birmingham infrastructure for adjacent metro. Target tech-forward families near NASA/defense employers.',
        impact: '+$25K GMV/quarter',
        effort: 'Medium',
        timeline: 'Q3 2024',
        kpis: ['Launch velocity', 'Owner quality score', 'Match rate'],
        status: 'Not Started',
      },
      {
        id: 'roll-3',
        title: 'Gulf Coast Corridor',
        description: 'Connect Mobile → Pensacola → Panama City. Shared owner base for seasonal businesses.',
        impact: '+$60K GMV/quarter',
        effort: 'High',
        timeline: 'Q4 2024',
        kpis: ['Cross-metro matches', 'Seasonal retention', 'Corridor GMV'],
        status: 'Not Started',
      },
    ],
  },
  {
    id: 'boltOn',
    label: 'Bolt-On Products',
    color: VECTOR_COLORS.boltOn,
    description: 'New revenue streams and product extensions',
    plays: [
      {
        id: 'bolt-1',
        title: 'SparkLocal Payments',
        description: 'In-app payment processing with instant payouts. Capture interchange + improve cash flow visibility.',
        impact: '+2% take rate',
        effort: 'High',
        timeline: 'Q3 2024',
        kpis: ['Payment adoption', 'Instant payout usage', 'Revenue per transaction'],
        status: 'Not Started',
      },
      {
        id: 'bolt-2',
        title: 'Verified Plus (Owners)',
        description: 'Premium owner tier with priority matching, featured placement, and advanced analytics. $49/mo.',
        impact: '+$15K MRR',
        effort: 'Medium',
        timeline: 'Q2 2024',
        kpis: ['Tier adoption', 'Churn rate', 'Feature usage'],
        status: 'In Progress',
      },
      {
        id: 'bolt-3',
        title: 'Portfolio Export',
        description: 'Generate college-application-ready portfolio PDFs from kid profiles. Partner with Common App.',
        impact: 'Differentiation moat',
        effort: 'Low',
        timeline: 'Q4 2024',
        kpis: ['Exports generated', 'College mentions', 'PR coverage'],
        status: 'Not Started',
      },
    ],
  },
  {
    id: 'margin',
    label: 'Margin Expansion',
    color: VECTOR_COLORS.margin,
    description: 'Improve unit economics and operational efficiency',
    plays: [
      {
        id: 'marg-1',
        title: 'Automated Matching V2',
        description: 'ML-powered matching to reduce manual curation. Cut ops cost per match by 60%.',
        impact: '-$0.40 CAC',
        effort: 'High',
        timeline: 'Q3 2024',
        kpis: ['Match accuracy', 'Ops hours saved', 'Cost per match'],
        status: 'Not Started',
      },
      {
        id: 'marg-2',
        title: 'Self-Serve Onboarding',
        description: 'Eliminate manual verification calls for low-risk owners. Auto-approve based on signals.',
        impact: '-30% onboarding cost',
        effort: 'Medium',
        timeline: 'Q2 2024',
        kpis: ['Auto-approval rate', 'Fraud rate', 'Time to first gig'],
        status: 'In Progress',
      },
      {
        id: 'marg-3',
        title: 'Support Tier 0',
        description: 'AI-powered support bot handles 50% of Tier 1 tickets. Reduce human support load.',
        impact: '-25% support cost',
        effort: 'Medium',
        timeline: 'Q3 2024',
        kpis: ['Bot resolution rate', 'Escalation rate', 'CSAT'],
        status: 'Not Started',
      },
    ],
  },
]

export const getVectorById = (id: VectorType): Vector | undefined => {
  return roadmapVectors.find((v) => v.id === id)
}
