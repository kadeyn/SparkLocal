// Owner profile — the single mentor whose OS we render at /owner/*
// In a real product this would be sourced from the auth session.

export interface OwnerProfile {
  id: string
  name: string
  businessName: string
  industry: string
  metro: string
  joinedAt: string // ISO date
  weeksOnPlatform: number
  tier: 'Free' | 'Verified Plus' | 'Enterprise'
  avatarInitials: string
  yearsInBusiness: number
}

export const ownerProfile: OwnerProfile = {
  id: 'owner-marcus',
  name: 'Marcus Thompson',
  businessName: 'Thompson HVAC & Air',
  industry: 'HVAC',
  metro: 'Mobile, AL',
  joinedAt: '2026-03-15',
  weeksOnPlatform: 8,
  tier: 'Free',
  avatarInitials: 'MT',
  yearsInBusiness: 17,
}
