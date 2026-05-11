import { useCallback, useEffect, useState } from 'react'
import { Award, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { track } from '@/lib/track'
import { ownerProfile } from '@/data/ownerProfile'
import { ownerPipeline } from '@/data/ownerPipeline'
import BadgeIssuanceForm from '@/components/badges/BadgeIssuanceForm'
import { getBadgeClass } from '@/lib/credentials/badgeSchema'
import {
  getProposalProvider,
  type BadgeProposal,
  type ProposalStatus,
} from '@/lib/credentials/proposalStore'
import { DemoDataBanner } from '../operator/shared'

const STATUS_STYLES: Record<ProposalStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  declined: 'bg-slate-200 text-slate-600',
  expired: 'bg-rose-100 text-rose-700',
}

// Mentor identity derived from the owner profile. PII rule: first name + last
// initial only — never the full last name in the credential body.
function deriveMentorDisplayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length <= 1) return fullName
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`
}

export default function BadgesView() {
  const [proposals, setProposals] = useState<BadgeProposal[]>([])
  const [loading, setLoading] = useState(true)

  const mentor = {
    id: ownerProfile.id,
    displayName: deriveMentorDisplayName(ownerProfile.name),
    businessName: ownerProfile.businessName,
  }

  const [metroCity, metroState] = ownerProfile.metro.split(',').map((s) => s.trim())

  const kids = ownerPipeline.map((k) => ({
    id: k.id,
    // ownerPipeline.name is "First L." — split on whitespace and keep first
    // name only.
    firstName: k.name.split(/\s+/)[0],
  }))

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const all = await getProposalProvider().listAll()
      setProposals(
        all
          .filter((p) => p.proposedBy.mentorId === mentor.id)
          .sort((a, b) => b.proposedAt.localeCompare(a.proposedAt)),
      )
    } finally {
      setLoading(false)
    }
  }, [mentor.id])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Badges</h1>
            <p className="text-sm text-slate-500">
              Propose Open Badges to kids you've worked with. They accept or decline — you don't
              push.
            </p>
          </div>
        </div>
        <DemoDataBanner />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issuance form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-1">Propose a badge</h2>
          <p className="text-xs text-slate-500 mb-4">
            They'll get a notification and decide. Either way, the gig record stands.
          </p>
          <BadgeIssuanceForm
            mentor={mentor}
            kids={kids}
            defaults={{ city: metroCity, state: metroState }}
            onProposed={(proposal) => {
              track('owner_badge_proposed', {
                badgeClassId: proposal.badgeClassId,
                kidId: proposal.recipientKidId,
              })
              void refresh()
            }}
          />
        </div>

        {/* Proposal funnel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Your proposals</h2>
              <p className="text-xs text-slate-500">Pending, accepted, declined, expired</p>
            </div>
            <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
              <RefreshCw className={cn('w-3.5 h-3.5 mr-1.5', loading && 'animate-spin')} />
              Refresh
            </Button>
          </div>

          {proposals.length === 0 ? (
            <p className="text-sm text-slate-500 italic">
              {loading ? 'Loading…' : 'No proposals yet. Send your first one →'}
            </p>
          ) : (
            <ul className="space-y-2">
              {proposals.map((p) => {
                const badge = getBadgeClass(p.badgeClassId)
                return (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {badge?.name ?? p.badgeClassId}
                        </p>
                        <Badge variant="secondary" className={STATUS_STYLES[p.status]}>
                          {p.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        To {p.recipientFirstName} ·{' '}
                        {new Date(p.proposedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
