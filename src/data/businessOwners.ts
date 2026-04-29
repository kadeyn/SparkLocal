export interface BusinessOwner {
  id: string
  name: string
  businessName: string
  businessType: string
  avatar: string
  location: string
  distance: string
  rating: number
  reviewCount: number
  verified: boolean
  description: string
  opportunities: Opportunity[]
  tags: string[]
}

export interface Opportunity {
  id: string
  title: string
  description: string
  pay: number
  payType: 'fixed' | 'hourly'
  estimatedHours: string
  skills: string[]
  urgent: boolean
  postedAt: string
}

export const businessOwners: BusinessOwner[] = [
  {
    id: 'marcus-1',
    name: 'Marcus Thompson',
    businessName: 'Thompson Auto Repair',
    businessType: 'Auto Shop',
    avatar: '/avatars/marcus.jpg',
    location: '1234 Main St',
    distance: '0.8 miles',
    rating: 4.9,
    reviewCount: 23,
    verified: true,
    description: 'Family-owned auto shop for 15 years. Looking for young helpers who want to learn about cars and customer service.',
    tags: ['Hands-on', 'Mentorship', 'Flexible Hours'],
    opportunities: [
      {
        id: 'marcus-opp-1',
        title: 'Social Media Content Creator',
        description: 'Help us create engaging TikTok and Instagram content showing car repairs and tips. Perfect for someone who loves cars and making videos!',
        pay: 45,
        payType: 'fixed',
        estimatedHours: '2-3 hours',
        skills: ['Video Editing', 'Social Media', 'Creativity'],
        urgent: false,
        postedAt: '2024-01-15',
      },
    ],
  },
  {
    id: 'lina-2',
    name: 'Lina Chen',
    businessName: 'Blossom Bakery',
    businessType: 'Bakery & Café',
    avatar: '/avatars/lina.jpg',
    location: '567 Oak Avenue',
    distance: '1.2 miles',
    rating: 4.8,
    reviewCount: 45,
    verified: true,
    description: 'Artisan bakery specializing in custom cakes and pastries. We love teaching young people about baking and small business!',
    tags: ['Creative', 'Food', 'Weekend Work'],
    opportunities: [
      {
        id: 'lina-opp-1',
        title: 'Menu & Flyer Designer',
        description: 'Design beautiful menus and promotional flyers for our spring collection. Must have an eye for design and food photography.',
        pay: 60,
        payType: 'fixed',
        estimatedHours: '3-4 hours',
        skills: ['Graphic Design', 'Photography', 'Canva'],
        urgent: true,
        postedAt: '2024-01-18',
      },
    ],
  },
  {
    id: 'devon-3',
    name: 'Devon Williams',
    businessName: 'FreshCuts Barbershop',
    businessType: 'Barbershop',
    avatar: '/avatars/devon.jpg',
    location: '890 MLK Boulevard',
    distance: '0.5 miles',
    rating: 5.0,
    reviewCount: 67,
    verified: true,
    description: 'Community barbershop that\'s been a neighborhood staple for 8 years. Big believer in youth entrepreneurship!',
    tags: ['Community', 'Flexible', 'Tips Included'],
    opportunities: [
      {
        id: 'devon-opp-1',
        title: 'Booking System Helper',
        description: 'Help set up and manage our new online booking system. Great for someone who\'s good with tech and apps.',
        pay: 15,
        payType: 'hourly',
        estimatedHours: '4-5 hours',
        skills: ['Tech Savvy', 'Organization', 'Customer Service'],
        urgent: false,
        postedAt: '2024-01-20',
      },
    ],
  },
  {
    id: 'patel-4',
    name: 'Ms. Priya Patel',
    businessName: 'Patel Family Grocery',
    businessType: 'Grocery Store',
    avatar: '/avatars/patel.jpg',
    location: '234 Commerce Drive',
    distance: '1.5 miles',
    rating: 4.7,
    reviewCount: 89,
    verified: true,
    description: 'Local grocery store with specialty Indian foods. We\'ve helped dozens of teens learn retail skills over the years.',
    tags: ['Retail', 'After School', 'Learn Business'],
    opportunities: [
      {
        id: 'patel-opp-1',
        title: 'Inventory Spreadsheet Organizer',
        description: 'Help digitize our inventory system into spreadsheets. Perfect for someone who loves organizing and working with numbers.',
        pay: 40,
        payType: 'fixed',
        estimatedHours: '3 hours',
        skills: ['Spreadsheets', 'Data Entry', 'Organization'],
        urgent: false,
        postedAt: '2024-01-12',
      },
    ],
  },
  {
    id: 'mike-5',
    name: 'Big Mike Rodriguez',
    businessName: 'Big Mike\'s Landscaping',
    businessType: 'Landscaping',
    avatar: '/avatars/mike.jpg',
    location: '456 Garden Way',
    distance: '2.0 miles',
    rating: 4.9,
    reviewCount: 34,
    verified: true,
    description: 'Full-service landscaping company. Great outdoor work for teens who don\'t mind getting their hands dirty!',
    tags: ['Outdoor', 'Physical', 'Good Pay'],
    opportunities: [
      {
        id: 'mike-opp-1',
        title: 'Before/After Photo Documenter',
        description: 'Take professional before and after photos of our landscaping projects for our website and social media.',
        pay: 35,
        payType: 'fixed',
        estimatedHours: '2 hours per project',
        skills: ['Photography', 'Attention to Detail'],
        urgent: true,
        postedAt: '2024-01-19',
      },
    ],
  },
  {
    id: 'aisha-6',
    name: 'Aisha Johnson',
    businessName: 'Glow Beauty Studio',
    businessType: 'Beauty Salon',
    avatar: '/avatars/aisha.jpg',
    location: '789 Style Street',
    distance: '0.9 miles',
    rating: 4.8,
    reviewCount: 112,
    verified: true,
    description: 'Modern beauty studio focused on natural hair and skincare. Love mentoring young entrepreneurs, especially in creative fields!',
    tags: ['Creative', 'Beauty', 'Social Media'],
    opportunities: [
      {
        id: 'aisha-opp-1',
        title: 'Instagram Reels Creator',
        description: 'Create trendy Instagram Reels showcasing our services and transformations. Must know current trends and have editing skills.',
        pay: 50,
        payType: 'fixed',
        estimatedHours: '2-3 hours',
        skills: ['Video Editing', 'Social Media', 'Trend Awareness'],
        urgent: false,
        postedAt: '2024-01-17',
      },
    ],
  },
]

export const getBusinessOwnerById = (id: string): BusinessOwner | undefined => {
  return businessOwners.find(owner => owner.id === id)
}

export const getAllOpportunities = (): (Opportunity & { business: BusinessOwner })[] => {
  return businessOwners.flatMap(owner =>
    owner.opportunities.map(opp => ({
      ...opp,
      business: owner,
    }))
  )
}
