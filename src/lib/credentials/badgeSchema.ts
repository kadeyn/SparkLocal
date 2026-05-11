// Open Badges 3.0 badge schema — typed badge class definitions.
// Conforms to the 1EdTech Open Badges 3.0 spec, which is built on the W3C
// Verifiable Credentials Data Model v2.0. Each badge class has a stable
// `id` that becomes part of every issued credential — never renumber
// these.

export type BadgeCategory =
  | 'skill_achievement'
  | 'gig_completion'
  | 'milestone'
  | 'mentor_endorsement'

export interface BadgeAlignment {
  targetName: string
  targetUrl: string // e.g. O*NET skill URL
  targetDescription?: string
  targetFramework?: string // e.g. 'O*NET-SOC'
  targetCode?: string
}

export interface ResultDescription {
  id: string
  type: 'ResultDescription'
  name: string
  valueMin?: string
  valueMax?: string
  resultType: 'RubricCriterionLevel' | 'Status' | 'LetterGrade'
}

export interface BadgeClass {
  id: string
  type: 'Achievement'
  name: string
  description: string
  category: BadgeCategory
  criteria: { narrative: string }
  image?: string // URL to badge artwork (V1: not set; fallback icons in UI)
  tag?: string[] // Searchable keywords
  alignment?: BadgeAlignment[] // Maps to external skill frameworks
  resultDescriptions?: ResultDescription[]
}

// SparkLocal canonical V1 badge classes. The keyed map lets us look up by
// short key OR by full `urn:` id (see getBadgeClass below).
export const BADGE_CLASSES: Record<string, BadgeClass> = {
  'first-hustle': {
    id: 'urn:sparklocal:badge:first-hustle',
    type: 'Achievement',
    name: 'First Hustle',
    description: 'Completed first paid gig on SparkLocal',
    category: 'milestone',
    criteria: {
      narrative:
        'Earned by completing a first paid gig with a verified mentor and receiving a 4+ star rating.',
    },
    tag: ['milestone', 'entrepreneurship', 'getting-started'],
  },
  'recurring-customer': {
    id: 'urn:sparklocal:badge:recurring-customer',
    type: 'Achievement',
    name: 'Recurring Customer',
    description: 'Earned trust enough to be hired twice by the same mentor',
    category: 'milestone',
    criteria: {
      narrative:
        'Earned when a single mentor hires the kid for a second gig within 90 days of the first.',
    },
    tag: ['trust', 'relationship', 'milestone'],
  },
  'social-media-content': {
    id: 'urn:sparklocal:badge:social-media-content',
    type: 'Achievement',
    name: 'Social Media Content Creator',
    description: 'Demonstrated ability to produce social media content for a business',
    category: 'skill_achievement',
    criteria: {
      narrative:
        'Completed 3+ social media content gigs with mentor approval. Skills include caption writing, basic photo/video editing, posting schedule management.',
    },
    tag: ['creative', 'marketing', 'digital'],
    alignment: [
      {
        targetName: 'Social Media Marketing',
        targetUrl: 'https://www.onetonline.org/link/summary/13-1161.00',
        targetFramework: 'O*NET-SOC',
        targetCode: '13-1161.00',
      },
    ],
  },
  'landscaping-basics': {
    id: 'urn:sparklocal:badge:landscaping-basics',
    type: 'Achievement',
    name: 'Landscaping Basics',
    description: 'Foundational skills in residential landscaping and yard maintenance',
    category: 'skill_achievement',
    criteria: {
      narrative:
        'Completed 5+ landscaping gigs covering lawn mowing, edging, basic plant care, and equipment safety.',
    },
    tag: ['trades', 'outdoor', 'physical'],
    alignment: [
      {
        targetName: 'Landscaping and Groundskeeping',
        targetUrl: 'https://www.onetonline.org/link/summary/37-3011.00',
        targetFramework: 'O*NET-SOC',
        targetCode: '37-3011.00',
      },
    ],
  },
  'apprentice-hvac': {
    id: 'urn:sparklocal:badge:apprentice-hvac',
    type: 'Achievement',
    name: 'HVAC Apprentice',
    description: 'Apprenticed with a licensed HVAC professional',
    category: 'skill_achievement',
    criteria: {
      narrative:
        'Logged 20+ hours with a licensed HVAC mentor. Skills include basic diagnostic, safety protocols, customer interaction.',
    },
    tag: ['trades', 'technical', 'apprenticeship'],
  },
  'mentor-endorsement': {
    id: 'urn:sparklocal:badge:mentor-endorsement',
    type: 'Achievement',
    name: 'Mentor Endorsement',
    description: 'Personal endorsement from a mentor — narrative-driven',
    category: 'mentor_endorsement',
    criteria: {
      narrative:
        "Awarded at mentor discretion. Contains a personalized narrative from the mentor about the kid's specific strengths.",
    },
    tag: ['endorsement', 'reference'],
  },
  'thousand-club': {
    id: 'urn:sparklocal:badge:thousand-club',
    type: 'Achievement',
    name: 'Thousand Club',
    description: 'Earned $1,000+ through SparkLocal gigs',
    category: 'milestone',
    criteria: { narrative: 'Cumulative earnings from SparkLocal gigs exceed $1,000.' },
    tag: ['milestone', 'earnings'],
  },
}

/**
 * Resolve a BadgeClass by either its short key (e.g. 'first-hustle') or its
 * full urn id (e.g. 'urn:sparklocal:badge:first-hustle'). Returns undefined
 * when nothing matches.
 */
export function getBadgeClass(id: string): BadgeClass | undefined {
  return BADGE_CLASSES[id] ?? Object.values(BADGE_CLASSES).find((b) => b.id === id)
}

export function listBadgeClasses(): BadgeClass[] {
  return Object.values(BADGE_CLASSES)
}
