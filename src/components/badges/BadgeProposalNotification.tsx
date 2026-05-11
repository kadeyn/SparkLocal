import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Check, Sparkles, X, Info, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BrandGradient } from '@/components/brand'
import { cn } from '@/lib/utils'
import { getBadgeClass } from '@/lib/credentials/badgeSchema'
import { getProposalProvider, type BadgeProposal } from '@/lib/credentials/proposalStore'

interface BadgeProposalNotificationProps {
  proposal: BadgeProposal
  kidId: string
  onAccepted?: (updated: BadgeProposal) => void
  onDeclined?: (updated: BadgeProposal) => void
}

export default function BadgeProposalNotification({
  proposal,
  kidId,
  onAccepted,
  onDeclined,
}: BadgeProposalNotificationProps) {
  const [busy, setBusy] = useState<'accept' | 'decline' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [explainerOpen, setExplainerOpen] = useState(false)

  const badgeClass = getBadgeClass(proposal.badgeClassId)
  const mentorFirstName = proposal.proposedBy.mentorDisplayName.split(' ')[0]

  const handleAccept = async () => {
    if (busy) return
    setBusy('accept')
    setError(null)
    try {
      const updated = await getProposalProvider().acceptProposal(proposal.id, kidId)
      onAccepted?.(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not accept the badge — try again.')
    } finally {
      setBusy(null)
    }
  }

  const handleDecline = async () => {
    if (busy) return
    setBusy('decline')
    setError(null)
    try {
      const updated = await getProposalProvider().declineProposal(proposal.id, kidId)
      onDeclined?.(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not decline — try again.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm"
    >
      {/* Header band — warm, restrained */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{
          background:
            'linear-gradient(90deg, rgba(79,70,229,0.08) 0%, rgba(251,113,133,0.08) 100%)',
        }}
      >
        <Sparkles className="w-4 h-4 text-indigo-600" />
        <p className="text-sm">
          <span className="font-medium text-slate-900">{mentorFirstName}</span>
          <span className="text-slate-600">
            {' '}
            is suggesting a badge for your portfolio
          </span>
        </p>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Badge artwork — fallback Award icon for V1 (no images yet) */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #fb7185 100%)',
            }}
          >
            <Award className="w-7 h-7 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900">
              {badgeClass?.name ?? 'Badge'}
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              {badgeClass?.description ?? 'Achievement'}
            </p>
            {(proposal.context.city || proposal.context.state) && (
              <p className="text-xs text-slate-400 mt-1">
                {proposal.context.city}
                {proposal.context.city && proposal.context.state ? ', ' : ''}
                {proposal.context.state}
                {proposal.context.completedAt &&
                  ` · ${new Date(proposal.context.completedAt).toLocaleDateString()}`}
              </p>
            )}
          </div>
        </div>

        {/* Mentor note */}
        {proposal.context.mentorNote && (
          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3">
            <p className="text-xs uppercase tracking-wider text-slate-500 mb-1 font-semibold">
              Note from {mentorFirstName}
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">{proposal.context.mentorNote}</p>
          </div>
        )}

        {/* Explanation copy */}
        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
          You can accept this badge (it'll join your portfolio — yours to share or not) or decline.
          Either way, your work on this gig is recorded.{' '}
          <button
            type="button"
            onClick={() => setExplainerOpen(true)}
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 underline-offset-2 underline"
          >
            <Info className="w-3 h-3" />
            What's an Open Badge?
          </button>
        </p>

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-100 p-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-700">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleAccept}
            disabled={busy !== null}
            className={cn(
              'flex-1 bg-gradient-to-r from-indigo-600 to-rose-500',
              'hover:from-indigo-500 hover:to-rose-400 text-white font-semibold',
            )}
          >
            <Check className="w-4 h-4 mr-1.5" />
            {busy === 'accept' ? 'Accepting…' : 'Accept'}
          </Button>
          <Button
            onClick={handleDecline}
            disabled={busy !== null}
            variant="outline"
            className="text-slate-600"
          >
            <X className="w-4 h-4 mr-1.5" />
            {busy === 'decline' ? 'Declining…' : 'Decline'}
          </Button>
        </div>
      </div>

      <Dialog open={explainerOpen} onOpenChange={setExplainerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              <BrandGradient as="span">Open Badges</BrandGradient> — yours to keep
            </DialogTitle>
            <DialogDescription className="sr-only">
              How Open Badges work in SparkLocal
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-indigo-600 font-semibold">1.</span>
              <span>
                A badge is a verifiable credential — a tamper-proof record signed by SparkLocal that
                proves you earned this achievement.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600 font-semibold">2.</span>
              <span>
                They work outside SparkLocal too. You can attach them to LinkedIn, college
                applications, or any platform that accepts Open Badges 3.0.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600 font-semibold">3.</span>
              <span>
                Once a badge is yours, SparkLocal doesn't control it. Even if you leave the platform
                (or age out at 18), the badge goes with you.
              </span>
            </li>
          </ul>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
