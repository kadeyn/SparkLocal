export interface AIGeneratedIdea {
  id: string
  title: string
  description: string
  matchScore: number
  estimatedEarnings: string
  timeCommitment: string
  skillsToUse: string[]
  skillsToLearn: string[]
  whyGoodFit: string
  suggestedBusinesses: string[]
  category: 'creative' | 'tech' | 'service' | 'physical'
}

// AI-generated opportunity ideas personalized for Kadeyn
export const aiIdeasForKadeyn: AIGeneratedIdea[] = [
  {
    id: 'ai-idea-1',
    title: 'Local Business Video Ads',
    description: 'Create short, engaging video advertisements for local businesses to use on social media. Combine your video editing skills with storytelling to help businesses attract more customers.',
    matchScore: 95,
    estimatedEarnings: '$40-75 per video',
    timeCommitment: '2-4 hours per project',
    skillsToUse: ['Video Editing', 'Creativity', 'Storytelling'],
    skillsToLearn: ['Marketing', 'Client Communication', 'Brand Strategy'],
    whyGoodFit: 'Your video editing skills and creative eye make this a natural fit. Several local businesses are actively looking for fresh, young perspectives on their social media content.',
    suggestedBusinesses: ['marcus-1', 'aisha-6', 'lina-2'],
    category: 'creative',
  },
  {
    id: 'ai-idea-2',
    title: 'Tech Setup Assistant',
    description: 'Help local business owners set up and troubleshoot their technology - from POS systems to online booking platforms. Many small business owners need help with tech but can\'t afford full IT support.',
    matchScore: 88,
    estimatedEarnings: '$15-20 per hour',
    timeCommitment: '1-3 hours per job',
    skillsToUse: ['Tech Savvy', 'Problem Solving', 'Patience'],
    skillsToLearn: ['Business Operations', 'Customer Service', 'Technical Documentation'],
    whyGoodFit: 'You\'re comfortable with technology and good at explaining things simply. Local businesses often struggle with tech setup and would appreciate patient, knowledgeable help.',
    suggestedBusinesses: ['devon-3', 'patel-4'],
    category: 'tech',
  },
  {
    id: 'ai-idea-3',
    title: 'Product Photography Service',
    description: 'Take professional-quality photos of products for local businesses to use on their websites, menus, and social media. Good lighting and composition can dramatically improve how products look online.',
    matchScore: 82,
    estimatedEarnings: '$30-50 per session',
    timeCommitment: '1-2 hours per session',
    skillsToUse: ['Photography', 'Attention to Detail', 'Creativity'],
    skillsToLearn: ['Photo Editing', 'Lighting Techniques', 'E-commerce'],
    whyGoodFit: 'Your eye for detail and interest in visual content would translate well to product photography. Many local businesses need better product images but don\'t have the budget for professional photographers.',
    suggestedBusinesses: ['lina-2', 'patel-4', 'aisha-6'],
    category: 'creative',
  },
  {
    id: 'ai-idea-4',
    title: 'Social Media Manager (Part-time)',
    description: 'Manage social media accounts for 1-2 local businesses. Schedule posts, respond to comments, and help grow their online presence using your knowledge of what\'s trending.',
    matchScore: 79,
    estimatedEarnings: '$50-100 per week per client',
    timeCommitment: '3-5 hours per week',
    skillsToUse: ['Social Media', 'Creativity', 'Writing'],
    skillsToLearn: ['Analytics', 'Content Strategy', 'Brand Voice'],
    whyGoodFit: 'You understand social media trends better than most adults! Local businesses struggle to keep up with platforms like TikTok and Instagram, and your generation\'s perspective is valuable.',
    suggestedBusinesses: ['aisha-6', 'devon-3', 'marcus-1'],
    category: 'creative',
  },
  {
    id: 'ai-idea-5',
    title: 'Digital Organization Consultant',
    description: 'Help businesses organize their digital files, set up cloud storage, create spreadsheet systems, and streamline their digital workflows. Many small businesses have messy digital systems that slow them down.',
    matchScore: 75,
    estimatedEarnings: '$35-60 per project',
    timeCommitment: '2-4 hours per project',
    skillsToUse: ['Organization', 'Spreadsheets', 'Tech Savvy'],
    skillsToLearn: ['Business Systems', 'Cloud Platforms', 'Process Improvement'],
    whyGoodFit: 'Your organizational skills and comfort with digital tools could help businesses work more efficiently. This is a service many businesses need but don\'t know how to ask for.',
    suggestedBusinesses: ['patel-4', 'mike-5', 'lina-2'],
    category: 'tech',
  },
]

export const getAIIdeaById = (id: string): AIGeneratedIdea | undefined => {
  return aiIdeasForKadeyn.find(idea => idea.id === id)
}

export const getTopAIIdeas = (count: number = 3): AIGeneratedIdea[] => {
  return [...aiIdeasForKadeyn]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, count)
}
