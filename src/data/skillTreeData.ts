export type NodeStatus = 'earned' | 'unlocked' | 'locked'

export interface SkillNode {
  id: string
  label: string
  description: string
  tier: 0 | 1 | 2 | 3 | 4
  status: NodeStatus
  xp: number
  parentIds: string[]
  challenge?: {
    title: string
    description: string
    steps: string[]
    estimatedTime: string
  }
}

// Skill tree structure:
// Tier 0: Start (1 node)
// Tier 1: Foundation skills (3 nodes)
// Tier 2: Applied skills (4 nodes)
// Tier 3: Advanced skills (3 nodes)
// Tier 4: Mastery (2 nodes)
// Total: 13 nodes

export const skillTreeNodes: SkillNode[] = [
  // Tier 0 - Start
  {
    id: 'start',
    label: 'Spark',
    description: 'Your journey begins! Complete the survey to discover your path.',
    tier: 0,
    status: 'earned',
    xp: 50,
    parentIds: [],
    challenge: {
      title: 'Complete Your Profile',
      description: 'Tell us about your interests and skills to unlock personalized opportunities.',
      steps: ['Complete the interest survey', 'Add a profile photo', 'Set your availability'],
      estimatedTime: '5 minutes',
    },
  },

  // Tier 1 - Foundation (3 nodes)
  {
    id: 'first-connection',
    label: 'First Connection',
    description: 'Make your first meaningful connection with a local business owner.',
    tier: 1,
    status: 'earned',
    xp: 100,
    parentIds: ['start'],
    challenge: {
      title: 'Connect with a Mentor',
      description: 'Reach out to a business owner and introduce yourself.',
      steps: ['Browse available mentors', 'Send an introduction message', 'Schedule a brief call or meeting'],
      estimatedTime: '30 minutes',
    },
  },
  {
    id: 'first-hustle',
    label: 'First Hustle',
    description: 'Complete your first paid opportunity and earn real money.',
    tier: 1,
    status: 'unlocked',
    xp: 150,
    parentIds: ['start'],
    challenge: {
      title: 'Complete Your First Gig',
      description: 'Apply for and complete a small project to earn your first payment.',
      steps: ['Find an opportunity that matches your skills', 'Apply with a brief pitch', 'Complete the work', 'Get paid!'],
      estimatedTime: '2-4 hours',
    },
  },
  {
    id: 'first-pitch',
    label: 'First Pitch',
    description: 'Present an idea to a business owner with confidence.',
    tier: 1,
    status: 'unlocked',
    xp: 125,
    parentIds: ['start'],
    challenge: {
      title: 'Pitch Your Services',
      description: 'Create and deliver a pitch for how you can help a local business.',
      steps: ['Identify a business problem you can solve', 'Prepare a 2-minute pitch', 'Practice and refine', 'Deliver to a business owner'],
      estimatedTime: '1-2 hours',
    },
  },

  // Tier 2 - Applied (4 nodes)
  {
    id: 'repeat-client',
    label: 'Repeat Client',
    description: 'Build a lasting relationship — get hired by the same business twice.',
    tier: 2,
    status: 'locked',
    xp: 200,
    parentIds: ['first-hustle', 'first-connection'],
    challenge: {
      title: 'Earn a Second Gig',
      description: 'Deliver such great work that a business wants to work with you again.',
      steps: ['Complete first project excellently', 'Follow up after completion', 'Propose a follow-up project', 'Get re-hired'],
      estimatedTime: 'Varies',
    },
  },
  {
    id: 'skill-stacker',
    label: 'Skill Stacker',
    description: 'Combine two different skills in one project to deliver extra value.',
    tier: 2,
    status: 'locked',
    xp: 175,
    parentIds: ['first-hustle'],
    challenge: {
      title: 'Multi-Skill Project',
      description: 'Complete a project that uses two or more of your skills together.',
      steps: ['Identify complementary skills', 'Find a project requiring both', 'Deliver combined value', 'Document your process'],
      estimatedTime: '3-5 hours',
    },
  },
  {
    id: 'public-presence',
    label: 'Public Presence',
    description: 'Your work gets featured — share your accomplishments publicly.',
    tier: 2,
    status: 'locked',
    xp: 150,
    parentIds: ['first-pitch'],
    challenge: {
      title: 'Share Your Success',
      description: 'Create content about your entrepreneurial journey to inspire others.',
      steps: ['Document a recent project', 'Create a post or video', 'Share on social media', 'Engage with responses'],
      estimatedTime: '1-2 hours',
    },
  },
  {
    id: 'feedback-loop',
    label: 'Feedback Loop',
    description: 'Actively seek and implement feedback to improve your work.',
    tier: 2,
    status: 'locked',
    xp: 175,
    parentIds: ['first-connection', 'first-pitch'],
    challenge: {
      title: 'Learn from Feedback',
      description: 'Request detailed feedback and show how you improved based on it.',
      steps: ['Complete a project', 'Ask for specific feedback', 'Create an improvement plan', 'Show the improvements in next project'],
      estimatedTime: '2-3 hours',
    },
  },

  // Tier 3 - Advanced (3 nodes)
  {
    id: 'mini-portfolio',
    label: 'Mini Portfolio',
    description: 'Curate 3+ completed projects into a professional portfolio.',
    tier: 3,
    status: 'locked',
    xp: 250,
    parentIds: ['repeat-client', 'skill-stacker'],
    challenge: {
      title: 'Build Your Portfolio',
      description: 'Create a professional showcase of your best work.',
      steps: ['Select your 3 best projects', 'Document the results', 'Create visual presentations', 'Publish on your profile'],
      estimatedTime: '3-4 hours',
    },
  },
  {
    id: 'mentor-moment',
    label: 'Mentor Moment',
    description: 'Help another young entrepreneur get started on their journey.',
    tier: 3,
    status: 'locked',
    xp: 225,
    parentIds: ['feedback-loop', 'public-presence'],
    challenge: {
      title: 'Pay It Forward',
      description: 'Share your knowledge with a newer member of the community.',
      steps: ['Connect with a newer member', 'Share your experiences', 'Offer guidance on a challenge', 'Celebrate their success'],
      estimatedTime: '1-2 hours',
    },
  },
  {
    id: 'hundred-club',
    label: '$100 Club',
    description: 'Reach $100 in lifetime earnings on the platform.',
    tier: 3,
    status: 'locked',
    xp: 300,
    parentIds: ['repeat-client'],
    challenge: {
      title: 'Reach $100 Earned',
      description: 'Hit your first major earnings milestone.',
      steps: ['Track your earnings', 'Complete consistent work', 'Celebrate at $100!'],
      estimatedTime: 'Ongoing',
    },
  },

  // Tier 4 - Mastery (2 nodes)
  {
    id: 'local-legend',
    label: 'Local Legend',
    description: 'Become a go-to resource for multiple businesses in your community.',
    tier: 4,
    status: 'locked',
    xp: 500,
    parentIds: ['mini-portfolio', 'hundred-club'],
    challenge: {
      title: 'Community Recognition',
      description: 'Be recommended by 3+ different business owners.',
      steps: ['Build strong relationships', 'Deliver exceptional work', 'Earn recommendations', 'Maintain your reputation'],
      estimatedTime: 'Ongoing',
    },
  },
  {
    id: 'spark-master',
    label: 'Spark Master',
    description: 'The ultimate achievement — you\'ve mastered the entrepreneurial spark.',
    tier: 4,
    status: 'locked',
    xp: 750,
    parentIds: ['local-legend', 'mentor-moment'],
    challenge: {
      title: 'Master Your Craft',
      description: 'Demonstrate mastery across all skill areas.',
      steps: ['Complete all previous challenges', 'Maintain 5-star ratings', 'Mentor others successfully', 'Earn the Spark Master badge'],
      estimatedTime: 'Ongoing',
    },
  },
]

// Helper functions
export const getNodeById = (id: string): SkillNode | undefined => {
  return skillTreeNodes.find((node) => node.id === id)
}

export const getNodesByTier = (tier: 0 | 1 | 2 | 3 | 4): SkillNode[] => {
  return skillTreeNodes.filter((node) => node.tier === tier)
}

export const getEarnedNodes = (): SkillNode[] => {
  return skillTreeNodes.filter((node) => node.status === 'earned')
}

export const getUnlockedNodes = (): SkillNode[] => {
  return skillTreeNodes.filter((node) => node.status === 'unlocked')
}

export const getTotalXP = (): number => {
  return skillTreeNodes
    .filter((node) => node.status === 'earned')
    .reduce((sum, node) => sum + node.xp, 0)
}

export const getProgressStats = () => {
  const earned = skillTreeNodes.filter((n) => n.status === 'earned').length
  const unlocked = skillTreeNodes.filter((n) => n.status === 'unlocked').length
  const total = skillTreeNodes.length
  return { earned, unlocked, total, xp: getTotalXP() }
}
