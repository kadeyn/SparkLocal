// Owner pipeline — kid candidates flowing through the four stages of an owner's hiring funnel.

export type PipelineStage = 'matched' | 'engaged' | 'active' | 'completed'

export interface KidCandidate {
  id: string
  name: string
  age: number
  interests: string[]
  stage: PipelineStage
  parentApproved: boolean
  matchScore: number // 0-100
  lastActivity: string // ISO timestamp
  hoursLogged?: number // populated for active/completed
  totalEarned?: number // populated for active/completed
  rating?: number // 1-5, populated for completed
  ratingNote?: string // populated for completed
  pendingAction?: string // human-readable next step the owner needs to take
}

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  matched: 'Matched',
  engaged: 'Engaged',
  active: 'Active',
  completed: 'Completed',
}

export const PIPELINE_STAGE_COLORS: Record<PipelineStage, string> = {
  matched: '#94a3b8',
  engaged: '#7B61FF',
  active: '#FFA94D',
  completed: '#22C8A9',
}

export const ownerPipeline: KidCandidate[] = [
  // Matched — algorithm-suggested, not yet engaged
  {
    id: 'kid-1',
    name: 'Jaylen R.',
    age: 16,
    interests: ['HVAC', 'Tools', 'Engines'],
    stage: 'matched',
    parentApproved: false,
    matchScore: 94,
    lastActivity: '2026-05-09T14:22:00Z',
    pendingAction: 'Send intro message',
  },
  {
    id: 'kid-2',
    name: 'Sofia M.',
    age: 15,
    interests: ['Social media', 'Customer service'],
    stage: 'matched',
    parentApproved: false,
    matchScore: 81,
    lastActivity: '2026-05-08T19:45:00Z',
    pendingAction: 'Review profile',
  },
  {
    id: 'kid-3',
    name: 'Devon K.',
    age: 17,
    interests: ['Electrical', 'Diagnostics'],
    stage: 'matched',
    parentApproved: false,
    matchScore: 89,
    lastActivity: '2026-05-07T11:08:00Z',
    pendingAction: 'Send intro message',
  },

  // Engaged — tapped interest + parent approval, intro scheduled
  {
    id: 'kid-4',
    name: 'Mia T.',
    age: 16,
    interests: ['HVAC', 'Refrigeration'],
    stage: 'engaged',
    parentApproved: true,
    matchScore: 91,
    lastActivity: '2026-05-10T10:00:00Z',
    pendingAction: 'Confirm Thursday shadow visit',
  },
  {
    id: 'kid-5',
    name: 'Andre J.',
    age: 17,
    interests: ['Mechanical', 'Welding'],
    stage: 'engaged',
    parentApproved: true,
    matchScore: 87,
    lastActivity: '2026-05-09T16:30:00Z',
    pendingAction: 'Send onboarding packet',
  },

  // Active — currently working/apprenticing
  {
    id: 'kid-6',
    name: 'Carlos V.',
    age: 17,
    interests: ['HVAC', 'Customer service'],
    stage: 'active',
    parentApproved: true,
    matchScore: 96,
    lastActivity: '2026-05-11T08:15:00Z',
    hoursLogged: 42,
    totalEarned: 588,
    pendingAction: 'Log this week’s hours',
  },
  {
    id: 'kid-7',
    name: 'Taylor W.',
    age: 15,
    interests: ['Social media', 'Photography'],
    stage: 'active',
    parentApproved: true,
    matchScore: 78,
    lastActivity: '2026-05-10T17:00:00Z',
    hoursLogged: 18,
    totalEarned: 270,
    pendingAction: 'Approve Instagram reel draft',
  },

  // Completed — wrapped, with mutual ratings
  {
    id: 'kid-8',
    name: 'Bryce L.',
    age: 18,
    interests: ['HVAC', 'Diagnostics'],
    stage: 'completed',
    parentApproved: true,
    matchScore: 92,
    lastActivity: '2026-04-28T14:00:00Z',
    hoursLogged: 96,
    totalEarned: 1440,
    rating: 5,
    ratingNote: 'Sharp learner. Could troubleshoot a thermostat by week 3. Hire again any day.',
  },
  {
    id: 'kid-9',
    name: 'Emma S.',
    age: 16,
    interests: ['Office admin', 'Scheduling'],
    stage: 'completed',
    parentApproved: true,
    matchScore: 73,
    lastActivity: '2026-04-15T12:00:00Z',
    hoursLogged: 32,
    totalEarned: 480,
    rating: 4,
    ratingNote: 'Reliable. Communication could be a hair quicker but solid all around.',
  },
]

export const getKidsByStage = (stage: PipelineStage): KidCandidate[] => {
  return ownerPipeline.filter((kid) => kid.stage === stage)
}

export const getKidById = (id: string): KidCandidate | undefined => {
  return ownerPipeline.find((kid) => kid.id === id)
}
