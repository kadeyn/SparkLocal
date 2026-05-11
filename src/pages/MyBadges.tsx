import BadgePortfolioView from '@/components/badges/BadgePortfolioView'
import { kadeynProfile } from '@/data/kidProfile'

export default function MyBadges() {
  // V1 uses the canonical mock kid profile. Replace with the authenticated
  // kid's id when real auth lands.
  const kidId = kadeynProfile.id

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <BadgePortfolioView kidId={kidId} />
      </div>
    </div>
  )
}
