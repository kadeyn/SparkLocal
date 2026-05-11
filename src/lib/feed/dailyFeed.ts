// SparkLocal Daily Feed — bounded discovery surface.
// Research brief §7: 5-8 cards per day, finite set, natural endpoints.
//
// This module is pure logic — types, scoring, count rules. State and
// persistence live in `dailyFeedStore.ts`; UI lives in
// `src/components/feed/*`. A future commit replaces the mock generator
// with a real recommender API; nothing in this file assumes a backend.

import type { Track } from '../compliance'

export type SwipeDirection = 'right' | 'left' | 'up'
export type CardStatus = 'unseen' | 'interested' | 'declined' | 'saved' | 'expired'

export interface OpportunityCard {
  id: string
  type: 'gig' | 'apprenticeship' | 'project'
  title: string
  // PII rule from prompt 2A carries forward: first name + last initial only,
  // city + state only, never an address.
  mentorFirstName: string
  mentorBusinessName: string
  city: string
  state: string
  estimatedPay: { amount: number; basis: 'flat' | 'hourly' }
  estimatedDuration: string // "30 min", "2 hours", "1 weekend"
  category: string // "creative" | "trades" | "tutoring" | "service"
  skillTags: string[]
  matchScore: number // 0-100, computed against the kid's stated interests/skills
  imageUrl?: string
}

export interface DailySet {
  date: string // YYYY-MM-DD in user's local time
  cards: OpportunityCard[]
  statusByCardId: Record<string, CardStatus>
  nextRefreshAt: string // ISO timestamp of tomorrow's refresh
  exhausted: boolean // True when every card has a non-`unseen` status
}

// Card count by track. Explorer is gated off in V1 (see compliance.ts) but
// the value lives here so V1.1 doesn't have to revisit this file.
const CARDS_PER_DAY: Record<Track, number> = {
  explorer: 5,
  builder: 8,
  pro: 8,
}

// When a kid already has an active gig, fewer new cards surface that day —
// the design intent is "your in-progress work is more important than
// browsing for the next thing."
const ACTIVE_GIG_MODIFIER = 0.4 // 40% of the normal count

export function getDailyCardCount(track: Track, hasActiveGig: boolean): number {
  const base = CARDS_PER_DAY[track]
  return hasActiveGig ? Math.max(2, Math.round(base * ACTIVE_GIG_MODIFIER)) : base
}

// Compute the next refresh timestamp. V1 hardcodes 6am the next day,
// referencing the device's local time (sufficient for the prototype). The
// `_userTimeZone` argument is plumbed for the V2 IANA-zone-aware version that
// will pull from user-stated working hours; it's intentionally unused today.
export function getNextRefreshTime(_userTimeZone: string): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(6, 0, 0, 0)
  return tomorrow.toISOString()
}

// V1 simple weighted overlap: interests count 60%, skills 40%. Replaced by a
// real recommender once the backend lands.
export function computeMatchScore(
  card: OpportunityCard,
  kidInterests: string[],
  kidSkills: string[],
): number {
  const tagCount = Math.max(card.skillTags.length, 1)
  const interestOverlap = card.skillTags.filter((t) => kidInterests.includes(t)).length
  const skillOverlap = card.skillTags.filter((t) => kidSkills.includes(t)).length
  const interestScore = (interestOverlap / tagCount) * 60
  const skillScore = (skillOverlap / tagCount) * 40
  return Math.round(interestScore + skillScore)
}

// Convenience — today's date in YYYY-MM-DD in device local time. Centralized
// so the store and the page agree on the same key.
export function todayKey(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
