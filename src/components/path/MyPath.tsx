// MyPath — "what I've done + what's next."
// Consolidates the prior Skill Tree + Future tabs into one progression view.
// Research brief §6: single highlighted current node, 2-4 adjacent
// unlocked-or-unlock-able next steps, hinted "far view" toward longer-term
// milestones. Single CTA: recommended next action.

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Lock,
  Plus,
  Sparkles,
  Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BrandGradient } from '@/components/brand'
import {
  getEarnedNodes,
  getUnlockedNodes,
  skillTreeNodes,
  type SkillNode,
} from '@/data/skillTreeData'
import { getProposalProvider, type BadgeProposal } from '@/lib/credentials/proposalStore'
import { getBadgeClass } from '@/lib/credentials/badgeSchema'

interface MyPathProps {
  kidId: string
  onNextStepClicked?: (stepType: string) => void
}

export default function MyPath({ kidId, onNextStepClicked }: MyPathProps) {
  const [badges, setBadges] = useState<BadgeProposal[]>([])

  useEffect(() => {
    let cancelled = false
    void getProposalProvider()
      .listAcceptedBadgesForKid(kidId)
      .then((list) => {
        if (!cancelled) setBadges(list)
      })
    return () => {
      cancelled = true
    }
  }, [kidId])

  const earned = getEarnedNodes()
  const unlocked = getUnlockedNodes()

  // Current focus = the highest-tier earned node — what the kid most
  // recently progressed past.
  const currentFocus = earned.length
    ? [...earned].sort((a, b) => b.tier - a.tier)[0]
    : skillTreeNodes[0]

  // Next steps = up to 4 unlocked nodes (kid CAN do these right now).
  const nextSteps = unlocked.slice(0, 4)

  // Far view = locked nodes at tier ≥ 2; hinted, not detailed.
  const farView = skillTreeNodes.filter((n) => n.status === 'locked' && n.tier >= 2).slice(0, 5)

  // Recommended next action — the first available unlocked node.
  const recommended = nextSteps[0] ?? currentFocus

  const handleStepClick = useCallback(
    (stepType: string) => {
      onNextStepClicked?.(stepType)
    },
    [onNextStepClicked],
  )

  return (
    <div className="space-y-6">
      {/* Hero — current focus */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-indigo-600 to-rose-500 text-white"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 80% 20%, rgba(255,255,255,0.5) 0%, transparent 50%),
                                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
            }}
          />
        </div>
        <div className="relative">
          <div className="text-[10px] uppercase tracking-wider text-white/80 font-semibold mb-1">
            Where you are
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            {currentFocus.label}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/85 max-w-prose">
            {currentFocus.description}
          </p>
          {earned.length > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/90">
              <Star className="w-3.5 h-3.5 fill-current" />
              {earned.length} earned · {unlocked.length} ready · {farView.length}+ on the horizon
            </div>
          )}
        </div>
      </motion.section>

      {/* What's next */}
      <section>
        <SectionHeader title="What's next" subtitle="Unlocked and ready" />
        {nextSteps.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            Complete your first gig to unlock the next step.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {nextSteps.map((node) => (
              <NextStepCard
                key={node.id}
                node={node}
                onClick={() => handleStepClick('unlocked_node')}
              />
            ))}
          </div>
        )}
      </section>

      {/* Far view */}
      {farView.length > 0 && (
        <section>
          <SectionHeader title="On the horizon" subtitle="Goals you can flag for later" />
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
            {farView.map((node) => (
              <FarViewCard
                key={node.id}
                node={node}
                onAdd={() => handleStepClick('far_goal_added')}
              />
            ))}
          </div>
        </section>
      )}

      {/* What you've done — accepted badges */}
      {badges.length > 0 && (
        <section>
          <SectionHeader
            title="What you've done"
            subtitle={`${badges.length} ${badges.length === 1 ? 'badge' : 'badges'} earned`}
          />
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
            {badges.map((proposal) => {
              const badge = getBadgeClass(proposal.badgeClassId)
              const mentorFirst = proposal.proposedBy.mentorDisplayName.split(' ')[0]
              return (
                <div
                  key={proposal.id}
                  className="shrink-0 w-44 snap-start rounded-2xl bg-white border border-slate-200 p-3"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                    style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #fb7185 100%)' }}
                  >
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 leading-tight">
                    {badge?.name ?? 'Badge'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">From {mentorFirst}</p>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Single primary CTA */}
      {recommended && (
        <motion.button
          type="button"
          onClick={() => handleStepClick('primary_cta')}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'w-full rounded-2xl px-5 py-4 text-left',
            'bg-slate-900 text-white shadow-lg',
            'flex items-center justify-between gap-3',
            'min-h-12',
          )}
        >
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">
              Continue
            </div>
            <div className="text-base font-semibold leading-tight">{recommended.label}</div>
            {recommended.challenge && (
              <div className="text-xs text-white/70 mt-0.5">
                <Clock className="w-3 h-3 inline mr-1" />
                {recommended.challenge.estimatedTime}
              </div>
            )}
          </div>
          <ArrowRight className="w-5 h-5 shrink-0 text-white" />
        </motion.button>
      )}
    </div>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-base font-bold text-slate-900">
        <BrandGradient as="span">{title}</BrandGradient>
      </h3>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  )
}

function NextStepCard({ node, onClick }: { node: SkillNode; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="text-left rounded-2xl bg-white border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all min-h-12"
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 leading-tight">{node.label}</p>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{node.description}</p>
        </div>
      </div>
      {node.challenge && (
        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2">
          <Clock className="w-3 h-3" />
          {node.challenge.estimatedTime}
          <span className="mx-1">·</span>
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          unlocked
        </div>
      )}
    </motion.button>
  )
}

function FarViewCard({ node, onAdd }: { node: SkillNode; onAdd: () => void }) {
  return (
    <div className="shrink-0 w-56 snap-start rounded-2xl bg-white border border-slate-200 p-3">
      <div className="flex items-start gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 leading-tight">{node.label}</p>
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{node.description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
      >
        <Plus className="w-3 h-3" />
        Add to my goals
      </button>
    </div>
  )
}
