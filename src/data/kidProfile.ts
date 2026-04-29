export interface KidProfile {
  id: string
  firstName: string
  lastName: string
  age: number
  grade: number
  avatar: string
  bio: string
  skills: Skill[]
  interests: string[]
  availability: Availability
  earnings: Earnings
  completedJobs: CompletedJob[]
  savedOpportunities: string[]
  parentId: string
}

export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
  verified: boolean
}

export interface Availability {
  weekdays: boolean
  weekends: boolean
  afterSchool: boolean
  maxHoursPerWeek: number
  preferredTimes: string[]
}

export interface Earnings {
  total: number
  thisMonth: number
  pending: number
  availableForWithdraw: number
}

export interface CompletedJob {
  id: string
  businessId: string
  businessName: string
  title: string
  completedAt: string
  earned: number
  rating: number
  review: string
}

// Kaden's profile
export const kadenProfile: KidProfile = {
  id: 'kaden-1',
  firstName: 'Kaden',
  lastName: 'S.',
  age: 14,
  grade: 9,
  avatar: '/avatars/kaden.jpg',
  bio: 'Creative 9th grader who loves making videos and learning about technology. Looking for opportunities to earn money while building real skills!',
  skills: [
    { name: 'Video Editing', level: 'intermediate', verified: true },
    { name: 'Social Media', level: 'advanced', verified: true },
    { name: 'Photography', level: 'beginner', verified: false },
    { name: 'Graphic Design', level: 'beginner', verified: false },
    { name: 'Spreadsheets', level: 'intermediate', verified: true },
    { name: 'Tech Savvy', level: 'advanced', verified: true },
  ],
  interests: [
    'Making videos',
    'Learning about business',
    'Technology',
    'Creative projects',
    'Helping people',
  ],
  availability: {
    weekdays: true,
    weekends: true,
    afterSchool: true,
    maxHoursPerWeek: 10,
    preferredTimes: ['After 3pm weekdays', 'Flexible weekends'],
  },
  earnings: {
    total: 185,
    thisMonth: 85,
    pending: 45,
    availableForWithdraw: 140,
  },
  completedJobs: [
    {
      id: 'job-1',
      businessId: 'devon-3',
      businessName: 'FreshCuts Barbershop',
      title: 'Instagram Story Templates',
      completedAt: '2024-01-10',
      earned: 35,
      rating: 5,
      review: 'Kaden did an amazing job! The templates look professional and he was easy to work with.',
    },
    {
      id: 'job-2',
      businessId: 'lina-2',
      businessName: 'Blossom Bakery',
      title: 'Product Photo Session',
      completedAt: '2024-01-05',
      earned: 50,
      rating: 5,
      review: 'Great eye for detail! The photos really made our pastries pop.',
    },
    {
      id: 'job-3',
      businessId: 'marcus-1',
      businessName: 'Thompson Auto Repair',
      title: 'TikTok Video Series',
      completedAt: '2023-12-20',
      earned: 100,
      rating: 4,
      review: 'Creative videos that helped us reach a younger audience. Would hire again!',
    },
  ],
  savedOpportunities: ['lina-opp-1', 'aisha-opp-1'],
  parentId: 'parent-1',
}

export const getKadenProfile = (): KidProfile => kadenProfile

export const getCompletedJobsCount = (): number => kadenProfile.completedJobs.length

export const getAverageRating = (): number => {
  const jobs = kadenProfile.completedJobs
  if (jobs.length === 0) return 0
  const total = jobs.reduce((sum, job) => sum + job.rating, 0)
  return Math.round((total / jobs.length) * 10) / 10
}
