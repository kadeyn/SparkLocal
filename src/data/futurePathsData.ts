import { businessOwners, type BusinessOwner } from './businessOwners'

export interface FuturePath {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  milestones: Milestone[]
}

export interface Milestone {
  id: string
  pathId: string
  age: number
  title: string
  description: string
  skills: string[]
  potentialEarnings?: string
  mentorIds?: string[]
}

export interface MentorNetwork {
  id: string
  businessOwnerId: string
  role: string
  connection: string
}

// Three future paths
export const futurePaths: FuturePath[] = [
  {
    id: 'creator-path',
    title: 'The Creator',
    subtitle: 'Build your brand',
    description: 'Turn your creative skills into a personal brand and business. From making videos to building an audience to launching products.',
    icon: 'Video',
    color: '#7B61FF',
    milestones: [
      {
        id: 'creator-14',
        pathId: 'creator-path',
        age: 14,
        title: 'Content Creator',
        description: 'Start creating content for local businesses. Learn video editing, social media strategy, and client communication.',
        skills: ['Video Editing', 'Social Media', 'Client Communication'],
        potentialEarnings: '$50-200/month',
        mentorIds: ['marcus-1', 'aisha-6'],
      },
      {
        id: 'creator-16',
        pathId: 'creator-path',
        age: 16,
        title: 'Freelance Creator',
        description: 'Build a portfolio of work and start taking on bigger clients. Develop your unique style and brand.',
        skills: ['Portfolio Building', 'Brand Development', 'Pricing Strategy'],
        potentialEarnings: '$300-800/month',
        mentorIds: ['aisha-6'],
      },
      {
        id: 'creator-18',
        pathId: 'creator-path',
        age: 18,
        title: 'Content Agency',
        description: 'Start your own creative agency or join an established one. Lead projects and manage client relationships.',
        skills: ['Project Management', 'Team Leadership', 'Business Development'],
        potentialEarnings: '$1,000-3,000/month',
      },
      {
        id: 'creator-22',
        pathId: 'creator-path',
        age: 22,
        title: 'Creative Director',
        description: 'Lead creative strategy for brands or build your own media company. Your early experience sets you apart.',
        skills: ['Creative Strategy', 'Team Building', 'Industry Leadership'],
        potentialEarnings: '$50K-100K/year',
      },
    ],
  },
  {
    id: 'entrepreneur-path',
    title: 'The Entrepreneur',
    subtitle: 'Build your business',
    description: 'Learn business fundamentals while young and build toward owning your own company. Start small, think big.',
    icon: 'Briefcase',
    color: '#22C8A9',
    milestones: [
      {
        id: 'entrepreneur-14',
        pathId: 'entrepreneur-path',
        age: 14,
        title: 'Business Explorer',
        description: 'Work with local business owners to learn how businesses operate. Understand customers, operations, and finance.',
        skills: ['Business Basics', 'Customer Service', 'Money Management'],
        potentialEarnings: '$50-150/month',
        mentorIds: ['devon-3', 'patel-4'],
      },
      {
        id: 'entrepreneur-16',
        pathId: 'entrepreneur-path',
        age: 16,
        title: 'Side Hustle Owner',
        description: 'Launch your first small business or service. Learn pricing, marketing, and customer acquisition.',
        skills: ['Marketing', 'Sales', 'Financial Planning'],
        potentialEarnings: '$200-600/month',
        mentorIds: ['marcus-1', 'devon-3'],
      },
      {
        id: 'entrepreneur-18',
        pathId: 'entrepreneur-path',
        age: 18,
        title: 'Business Owner',
        description: 'Scale your business or start a new venture with your accumulated experience and network.',
        skills: ['Operations', 'Hiring', 'Strategic Planning'],
        potentialEarnings: '$1,500-5,000/month',
      },
      {
        id: 'entrepreneur-22',
        pathId: 'entrepreneur-path',
        age: 22,
        title: 'Serial Entrepreneur',
        description: 'Build multiple businesses or invest in others. Your early start gives you a decade of experience.',
        skills: ['Investment', 'Mentorship', 'Industry Expertise'],
        potentialEarnings: '$80K-200K+/year',
      },
    ],
  },
  {
    id: 'specialist-path',
    title: 'The Specialist',
    subtitle: 'Master your craft',
    description: 'Develop deep expertise in a specific skill or trade. Become the go-to person that everyone wants to hire.',
    icon: 'Award',
    color: '#F97362',
    milestones: [
      {
        id: 'specialist-14',
        pathId: 'specialist-path',
        age: 14,
        title: 'Skill Apprentice',
        description: 'Learn the fundamentals of your chosen craft from experienced professionals in your community.',
        skills: ['Technical Basics', 'Work Ethic', 'Learning Mindset'],
        potentialEarnings: '$40-120/month',
        mentorIds: ['lina-2', 'mike-5'],
      },
      {
        id: 'specialist-16',
        pathId: 'specialist-path',
        age: 16,
        title: 'Junior Specialist',
        description: 'Take on more complex projects and start building a reputation for quality work.',
        skills: ['Advanced Techniques', 'Quality Standards', 'Time Management'],
        potentialEarnings: '$200-500/month',
        mentorIds: ['marcus-1', 'lina-2'],
      },
      {
        id: 'specialist-18',
        pathId: 'specialist-path',
        age: 18,
        title: 'Professional',
        description: 'Work at a professional level with certifications and formal training building on your hands-on experience.',
        skills: ['Professional Certification', 'Client Relations', 'Specialization'],
        potentialEarnings: '$800-2,500/month',
      },
      {
        id: 'specialist-22',
        pathId: 'specialist-path',
        age: 22,
        title: 'Master Craftsperson',
        description: 'Lead your field with recognized expertise. Train others and set industry standards.',
        skills: ['Mastery', 'Teaching', 'Innovation'],
        potentialEarnings: '$60K-120K/year',
      },
    ],
  },
]

// Mentor network connections shown at bottom of future paths
export const mentorNetwork: MentorNetwork[] = [
  {
    id: 'network-1',
    businessOwnerId: 'marcus-1',
    role: 'Auto & Content',
    connection: 'Video marketing mentor',
  },
  {
    id: 'network-2',
    businessOwnerId: 'lina-2',
    role: 'Food & Design',
    connection: 'Creative business mentor',
  },
  {
    id: 'network-3',
    businessOwnerId: 'devon-3',
    role: 'Community Hub',
    connection: 'Customer service expert',
  },
  {
    id: 'network-4',
    businessOwnerId: 'patel-4',
    role: 'Retail Veteran',
    connection: 'Business operations guide',
  },
  {
    id: 'network-5',
    businessOwnerId: 'mike-5',
    role: 'Outdoor Work',
    connection: 'Hands-on skills mentor',
  },
  {
    id: 'network-6',
    businessOwnerId: 'aisha-6',
    role: 'Beauty & Social',
    connection: 'Social media strategist',
  },
]

// Helper functions
export const getFuturePathById = (id: string): FuturePath | undefined => {
  return futurePaths.find((p) => p.id === id)
}

export const getMilestoneById = (id: string): Milestone | undefined => {
  for (const path of futurePaths) {
    const milestone = path.milestones.find((m) => m.id === id)
    if (milestone) return milestone
  }
  return undefined
}

export const getMilestonesForPath = (pathId: string): Milestone[] => {
  const path = getFuturePathById(pathId)
  return path?.milestones || []
}

export const getMentorNetworkBusinessOwners = (): (BusinessOwner & { role: string; connection: string })[] => {
  return mentorNetwork
    .map((mn) => {
      const owner = businessOwners.find((b) => b.id === mn.businessOwnerId)
      if (!owner) return null
      return { ...owner, role: mn.role, connection: mn.connection }
    })
    .filter((o): o is BusinessOwner & { role: string; connection: string } => o !== null)
}

export const getBusinessOwnerById = (id: string): BusinessOwner | undefined => {
  return businessOwners.find((b) => b.id === id)
}
