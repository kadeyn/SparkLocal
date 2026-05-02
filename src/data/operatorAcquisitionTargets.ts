// LBO/M&A - Acquisition targets for roll-up strategy

export interface AcquisitionTarget {
  id: string
  name: string
  description: string
  location: string
  type: 'competitor' | 'adjacent' | 'infrastructure'
  metrics: {
    gmv: number // Annual GMV in thousands
    revenue: number // Annual revenue in thousands
    ebitda: number // EBITDA in thousands
    users: number // Active users
    growth: number // YoY growth percentage
  }
  askingPrice: number // In thousands
  synergies: {
    revenueSynergies: number // Annual revenue synergies in thousands
    costSynergies: number // Annual cost synergies in thousands
    timeline: string
  }
  risks: string[]
  strengths: string[]
}

export const acquisitionTargets: AcquisitionTarget[] = [
  {
    id: 'target-1',
    name: 'YouthGigs ATL',
    description: 'Atlanta-based youth job marketplace focused on retail and hospitality. Strong brand recognition in Georgia.',
    location: 'Atlanta, GA',
    type: 'competitor',
    metrics: {
      gmv: 1200,
      revenue: 144,
      ebitda: -85,
      users: 2400,
      growth: 45,
    },
    askingPrice: 850,
    synergies: {
      revenueSynergies: 80,
      costSynergies: 120,
      timeline: '12-18 months post-close',
    },
    risks: [
      'Founder departure risk - key relationships with Atlanta schools',
      'Technology debt - legacy PHP codebase needs migration',
      'Different safety standards - may need compliance remediation',
    ],
    strengths: [
      'Established presence in Atlanta metro (top 10 US market)',
      'Strong school district relationships',
      'Complementary vertical focus (retail/hospitality)',
    ],
  },
  {
    id: 'target-2',
    name: 'KidVerify',
    description: 'Background check and verification platform specifically designed for youth employment. B2B SaaS model.',
    location: 'Austin, TX',
    type: 'infrastructure',
    metrics: {
      gmv: 0,
      revenue: 420,
      ebitda: 65,
      users: 180, // B2B customers
      growth: 28,
    },
    askingPrice: 2100,
    synergies: {
      revenueSynergies: 45,
      costSynergies: 180,
      timeline: '6-12 months post-close',
    },
    risks: [
      'Customer concentration - top 3 customers are 40% of revenue',
      'Regulatory changes in youth employment verification',
      'Team retention - small team with key person risk',
    ],
    strengths: [
      'Proprietary youth-specific verification technology',
      'COPPA-compliant data infrastructure',
      'Reduces our verification cost by 60%',
      'Could become profit center selling to competitors',
    ],
  },
  {
    id: 'target-3',
    name: 'LocalPro Network',
    description: 'Network of vetted local businesses in Southeast US. Focus on service businesses (landscaping, auto, home services).',
    location: 'Nashville, TN',
    type: 'adjacent',
    metrics: {
      gmv: 4800,
      revenue: 380,
      ebitda: 42,
      users: 3200, // SMB owners
      growth: 15,
    },
    askingPrice: 1650,
    synergies: {
      revenueSynergies: 220,
      costSynergies: 85,
      timeline: '18-24 months post-close',
    },
    risks: [
      'Different target market (adult contractors, not youth)',
      'Geographic footprint requires integration planning',
      'Brand positioning confusion during transition',
    ],
    strengths: [
      '3,200 pre-vetted business owners in our target verticals',
      'Established in 4 metros we want to enter',
      'Revenue-positive acquisition (not a cash burn)',
      'Owner-first acquisition creates supply-side leverage',
    ],
  },
]

export const getTargetById = (id: string): AcquisitionTarget | undefined => {
  return acquisitionTargets.find((t) => t.id === id)
}

// LBO calculation helpers
export interface LBOScenario {
  targetId: string
  debtPercentage: number
  interestRate: number
  holdPeriod: number
  exitMultiple: number
}

export const calculateLBOReturns = (
  target: AcquisitionTarget,
  scenario: LBOScenario
): {
  equityInvested: number
  debtAmount: number
  totalSources: number
  projectedEbitda: number
  exitValue: number
  equityValue: number
  moic: number
  irr: number
} => {
  const { askingPrice, metrics, synergies } = target
  const { debtPercentage, interestRate, holdPeriod, exitMultiple } = scenario

  const debtAmount = (askingPrice * debtPercentage) / 100
  const equityInvested = askingPrice - debtAmount
  const totalSources = askingPrice

  // Project EBITDA with synergies
  const baseSynergies = synergies.revenueSynergies + synergies.costSynergies
  const projectedEbitda = metrics.ebitda + baseSynergies

  // Calculate exit
  const exitValue = projectedEbitda * exitMultiple

  // Debt paydown (simplified - assume linear paydown over hold period)
  const annualDebtPayment = debtAmount / holdPeriod
  const remainingDebt = Math.max(0, debtAmount - annualDebtPayment * holdPeriod)
  const interestPaid = debtAmount * (interestRate / 100) * holdPeriod

  const equityValue = exitValue - remainingDebt - interestPaid

  // Returns
  const moic = equityValue / equityInvested
  const irr = Math.pow(moic, 1 / holdPeriod) - 1

  return {
    equityInvested,
    debtAmount,
    totalSources,
    projectedEbitda,
    exitValue,
    equityValue,
    moic: Math.round(moic * 100) / 100,
    irr: Math.round(irr * 1000) / 10,
  }
}
