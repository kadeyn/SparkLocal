import { businessOwners, type BusinessOwner } from './businessOwners'

export interface Galaxy {
  id: string
  name: string
  description: string
  color: string
  icon: string
  careerCount: number
}

export interface Career {
  id: string
  galaxyId: string
  title: string
  description: string
  avgSalary: string
  growthRate: string
  matchScore: number
  skills: string[]
  mentorIds: string[]
}

export interface Mentor {
  id: string
  businessOwnerId: string
  specialty: string
  yearsExperience: number
  bio: string
  availability: 'available' | 'busy' | 'unavailable'
  rating: number
  studentsHelped: number
}

// Three galaxies matching survey categories
export const galaxies: Galaxy[] = [
  {
    id: 'creative',
    name: 'Creative Galaxy',
    description: 'Design, video, art, and content creation careers',
    color: '#7B61FF',
    icon: 'Palette',
    careerCount: 4,
  },
  {
    id: 'trades',
    name: 'Trades Galaxy',
    description: 'Hands-on skills, craftsmanship, and building careers',
    color: '#F97362',
    icon: 'Wrench',
    careerCount: 3,
  },
  {
    id: 'service',
    name: 'Service Galaxy',
    description: 'People-focused, community, and hospitality careers',
    color: '#22C8A9',
    icon: 'Users',
    careerCount: 3,
  },
]

// Careers within each galaxy
export const careers: Career[] = [
  // Creative Galaxy
  {
    id: 'video-creator',
    galaxyId: 'creative',
    title: 'Video Creator',
    description: 'Create engaging video content for brands, social media, and entertainment.',
    avgSalary: '$45K - $85K',
    growthRate: '+25% by 2030',
    matchScore: 95,
    skills: ['Video Editing', 'Storytelling', 'Social Media', 'Creativity'],
    mentorIds: ['mentor-marcus', 'mentor-aisha'],
  },
  {
    id: 'graphic-designer',
    galaxyId: 'creative',
    title: 'Graphic Designer',
    description: 'Design visual content for print, digital, and brand identities.',
    avgSalary: '$40K - $75K',
    growthRate: '+10% by 2030',
    matchScore: 82,
    skills: ['Design', 'Typography', 'Color Theory', 'Brand Strategy'],
    mentorIds: ['mentor-lina', 'mentor-aisha'],
  },
  {
    id: 'social-media-manager',
    galaxyId: 'creative',
    title: 'Social Media Manager',
    description: 'Manage brand presence and engagement across social platforms.',
    avgSalary: '$35K - $65K',
    growthRate: '+18% by 2030',
    matchScore: 88,
    skills: ['Social Media', 'Content Creation', 'Analytics', 'Community Building'],
    mentorIds: ['mentor-aisha', 'mentor-devon'],
  },
  {
    id: 'photographer',
    galaxyId: 'creative',
    title: 'Photographer',
    description: 'Capture moments and create visual stories through photography.',
    avgSalary: '$30K - $70K',
    growthRate: '+8% by 2030',
    matchScore: 75,
    skills: ['Photography', 'Lighting', 'Editing', 'Visual Storytelling'],
    mentorIds: ['mentor-lina', 'mentor-mike'],
  },

  // Trades Galaxy
  {
    id: 'auto-tech',
    galaxyId: 'trades',
    title: 'Automotive Technician',
    description: 'Diagnose, repair, and maintain vehicles using technical expertise.',
    avgSalary: '$35K - $65K',
    growthRate: '+5% by 2030',
    matchScore: 70,
    skills: ['Mechanical Skills', 'Diagnostics', 'Problem Solving', 'Technology'],
    mentorIds: ['mentor-marcus'],
  },
  {
    id: 'landscape-design',
    galaxyId: 'trades',
    title: 'Landscape Designer',
    description: 'Design and create outdoor spaces that blend beauty with function.',
    avgSalary: '$40K - $75K',
    growthRate: '+12% by 2030',
    matchScore: 65,
    skills: ['Design', 'Plant Knowledge', 'Project Management', 'Physical Fitness'],
    mentorIds: ['mentor-mike'],
  },
  {
    id: 'baker-chef',
    galaxyId: 'trades',
    title: 'Baker / Pastry Chef',
    description: 'Create delicious baked goods and pastries with artistic flair.',
    avgSalary: '$30K - $55K',
    growthRate: '+8% by 2030',
    matchScore: 72,
    skills: ['Baking', 'Creativity', 'Attention to Detail', 'Time Management'],
    mentorIds: ['mentor-lina'],
  },

  // Service Galaxy
  {
    id: 'small-business-owner',
    galaxyId: 'service',
    title: 'Small Business Owner',
    description: 'Build and run your own business serving your community.',
    avgSalary: 'Varies widely',
    growthRate: '+15% by 2030',
    matchScore: 85,
    skills: ['Leadership', 'Finance', 'Marketing', 'Customer Service'],
    mentorIds: ['mentor-devon', 'mentor-patel', 'mentor-marcus'],
  },
  {
    id: 'community-manager',
    galaxyId: 'service',
    title: 'Community Manager',
    description: 'Build and nurture communities around brands or causes.',
    avgSalary: '$40K - $70K',
    growthRate: '+20% by 2030',
    matchScore: 78,
    skills: ['Communication', 'Event Planning', 'Empathy', 'Social Media'],
    mentorIds: ['mentor-devon', 'mentor-aisha'],
  },
  {
    id: 'retail-manager',
    galaxyId: 'service',
    title: 'Retail Manager',
    description: 'Lead retail operations and create great customer experiences.',
    avgSalary: '$35K - $60K',
    growthRate: '+6% by 2030',
    matchScore: 68,
    skills: ['Leadership', 'Customer Service', 'Inventory', 'Sales'],
    mentorIds: ['mentor-patel'],
  },
]

// Mentors linked to business owners
export const mentors: Mentor[] = [
  {
    id: 'mentor-marcus',
    businessOwnerId: 'marcus-1',
    specialty: 'Automotive Business & Video Marketing',
    yearsExperience: 15,
    bio: 'Started Thompson Auto as a side hustle and grew it into a family business. Love teaching young people about cars and content creation.',
    availability: 'available',
    rating: 4.9,
    studentsHelped: 12,
  },
  {
    id: 'mentor-lina',
    businessOwnerId: 'lina-2',
    specialty: 'Food Business & Visual Branding',
    yearsExperience: 8,
    bio: 'Turned my passion for baking into a thriving bakery. Excited to help young entrepreneurs find their creative spark.',
    availability: 'available',
    rating: 4.8,
    studentsHelped: 8,
  },
  {
    id: 'mentor-devon',
    businessOwnerId: 'devon-3',
    specialty: 'Community Business & Customer Service',
    yearsExperience: 8,
    bio: 'My barbershop is a community hub. I believe in giving back and helping young people build their confidence.',
    availability: 'available',
    rating: 5.0,
    studentsHelped: 23,
  },
  {
    id: 'mentor-patel',
    businessOwnerId: 'patel-4',
    specialty: 'Retail Operations & Business Management',
    yearsExperience: 20,
    bio: 'Three generations of family business experience. Happy to share what I\'ve learned about running a store.',
    availability: 'busy',
    rating: 4.7,
    studentsHelped: 15,
  },
  {
    id: 'mentor-mike',
    businessOwnerId: 'mike-5',
    specialty: 'Landscaping & Outdoor Work',
    yearsExperience: 12,
    bio: 'Built my landscaping business from a single lawnmower. Love showing young people the rewards of physical work.',
    availability: 'available',
    rating: 4.9,
    studentsHelped: 9,
  },
  {
    id: 'mentor-aisha',
    businessOwnerId: 'aisha-6',
    specialty: 'Beauty Business & Social Media',
    yearsExperience: 6,
    bio: 'Social media helped me grow from a home salon to a full studio. Passionate about helping young creatives succeed.',
    availability: 'available',
    rating: 4.8,
    studentsHelped: 18,
  },
]

// Helper functions
export const getGalaxyById = (id: string): Galaxy | undefined => {
  return galaxies.find((g) => g.id === id)
}

export const getCareersByGalaxy = (galaxyId: string): Career[] => {
  return careers.filter((c) => c.galaxyId === galaxyId)
}

export const getCareerById = (id: string): Career | undefined => {
  return careers.find((c) => c.id === id)
}

export const getMentorById = (id: string): Mentor | undefined => {
  return mentors.find((m) => m.id === id)
}

export const getMentorsByCareer = (careerId: string): Mentor[] => {
  const career = getCareerById(careerId)
  if (!career) return []
  return career.mentorIds
    .map((id) => getMentorById(id))
    .filter((m): m is Mentor => m !== undefined)
}

export const getBusinessOwnerForMentor = (mentorId: string): BusinessOwner | undefined => {
  const mentor = getMentorById(mentorId)
  if (!mentor) return undefined
  return businessOwners.find((b) => b.id === mentor.businessOwnerId)
}

export const getTopCareers = (count: number = 3): Career[] => {
  return [...careers].sort((a, b) => b.matchScore - a.matchScore).slice(0, count)
}
