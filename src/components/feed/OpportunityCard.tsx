import { motion, type MotionValue, useTransform } from 'framer-motion'
import {
  Briefcase,
  Clock,
  GraduationCap,
  Hammer,
  Heart,
  MapPin,
  PaintBucket,
  Wrench,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Track } from '@/lib/compliance'
import type { OpportunityCard as OpportunityCardData } from '@/lib/feed/dailyFeed'

interface OpportunityCardProps {
  card: OpportunityCardData
  track: Track
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  creative: PaintBucket,
  trades: Hammer,
  tutoring: GraduationCap,
  service: Wrench,
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  creative: 'from-violet-500/15 to-rose-500/10',
  trades: 'from-amber-500/15 to-orange-500/10',
  tutoring: 'from-emerald-500/15 to-teal-500/10',
  service: 'from-sky-500/15 to-indigo-500/10',
}

const TYPE_LABEL: Record<OpportunityCardData['type'], string> = {
  gig: 'Gig',
  apprenticeship: 'Apprenticeship',
  project: 'Project',
}

// Track-specific visual register. Mechanics are identical across tracks;
// only decoration changes (research brief §7).
const TRACK_STYLE: Record<Track, { padding: string; titleSize: string; rounding: string }> = {
  explorer: { padding: 'p-6', titleSize: 'text-2xl', rounding: 'rounded-3xl' }, // warmer, more space
  builder: { padding: 'p-5', titleSize: 'text-xl', rounding: 'rounded-2xl' }, // standard
  pro: { padding: 'p-4', titleSize: 'text-lg', rounding: 'rounded-xl' }, // denser, more professional
}

export default function OpportunityCard({ card, track }: OpportunityCardProps) {
  const Icon = CATEGORY_ICONS[card.category] ?? Briefcase
  const gradient = CATEGORY_GRADIENTS[card.category] ?? 'from-slate-100 to-white'
  const ts = TRACK_STYLE[track]

  return (
    <div
      className={cn(
        ts.rounding,
        ts.padding,
        'relative bg-white border border-slate-200 shadow-sm h-full w-full overflow-hidden flex flex-col',
        'bg-gradient-to-br',
        gradient,
      )}
      style={{ touchAction: 'none' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-slate-700" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              {TYPE_LABEL[card.type]} · {card.category}
            </div>
            <div className="text-sm font-medium text-slate-800 truncate">
              {card.mentorBusinessName}
            </div>
          </div>
        </div>
        {card.matchScore > 0 && (
          <div className="shrink-0 px-2 py-1 rounded-full bg-white/80 border border-slate-200">
            <span
              className="text-xs font-semibold text-slate-700"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              {card.matchScore}
            </span>
            <span className="text-[10px] text-slate-500 ml-0.5">match</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className={cn(ts.titleSize, 'font-bold text-slate-900 leading-tight mb-2')}>
        {card.title}
      </h3>

      <p className="text-sm text-slate-600 mb-4">
        With <span className="font-medium text-slate-800">{card.mentorFirstName}</span>
      </p>

      {/* Pay + duration */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg bg-white/80 border border-slate-200 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            Pay
          </div>
          <div
            className="text-base font-bold text-slate-900"
            style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            ${card.estimatedPay.amount}
            <span className="text-xs text-slate-500 font-normal ml-0.5">
              {card.estimatedPay.basis === 'hourly' ? '/hr' : ' flat'}
            </span>
          </div>
        </div>
        <div className="rounded-lg bg-white/80 border border-slate-200 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> Time
          </div>
          <div className="text-sm font-semibold text-slate-900">{card.estimatedDuration}</div>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4">
        <MapPin className="w-3.5 h-3.5 text-slate-400" />
        {card.city}, {card.state}
      </div>

      {/* Skill tags */}
      <div className="mt-auto pt-3 border-t border-slate-200/60">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
          You'd use
        </div>
        <div className="flex flex-wrap gap-1.5">
          {card.skillTags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-slate-200 text-xs text-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Drag-driven YES / NO / SAVE overlay labels. Rendered only on the top card
 * by SwipeStack, which is the only place we have stable motion values to
 * bind. Kept in its own component so the hooks below are called
 * unconditionally.
 */
export function CardSwipeOverlays({ x, y }: { x: MotionValue<number>; y: MotionValue<number> }) {
  const interestedOpacity = useTransform(x, [40, 160], [0, 1])
  const declinedOpacity = useTransform(x, [-160, -40], [1, 0])
  const savedOpacity = useTransform(y, [-160, -40], [1, 0])

  return (
    <>
      <motion.div
        style={{ opacity: interestedOpacity }}
        className="absolute top-6 left-6 z-30 px-3 py-1.5 rounded-lg border-4 border-emerald-500 text-emerald-600 font-extrabold tracking-wider text-lg -rotate-12 pointer-events-none"
      >
        INTERESTED
      </motion.div>
      <motion.div
        style={{ opacity: declinedOpacity }}
        className="absolute top-6 right-6 z-30 px-3 py-1.5 rounded-lg border-4 border-slate-500 text-slate-600 font-extrabold tracking-wider text-lg rotate-12 pointer-events-none"
      >
        NOT FOR ME
      </motion.div>
      <motion.div
        style={{ opacity: savedOpacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-4 py-2 rounded-lg border-4 border-amber-500 text-amber-600 font-extrabold tracking-wider text-xl pointer-events-none"
      >
        SAVED
      </motion.div>
    </>
  )
}

/** Tap-driven action surface — same swipe outcomes, for accessibility. */
export function CardActionButtons({
  onDecline,
  onSave,
  onAccept,
  disabled,
}: {
  onDecline: () => void
  onSave: () => void
  onAccept: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-center gap-4 select-none">
      <ActionButton
        ariaLabel="Not for me"
        onClick={onDecline}
        disabled={disabled}
        className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
      >
        <X className="w-6 h-6" />
      </ActionButton>
      <ActionButton
        ariaLabel="Save for later"
        onClick={onSave}
        disabled={disabled}
        className="bg-amber-500 text-white hover:bg-amber-400 border-amber-500"
      >
        <Briefcase className="w-5 h-5" />
      </ActionButton>
      <ActionButton
        ariaLabel="I'm interested"
        onClick={onAccept}
        disabled={disabled}
        className="bg-emerald-500 text-white hover:bg-emerald-400 border-emerald-500"
      >
        <Heart className="w-6 h-6 fill-current" />
      </ActionButton>
    </div>
  )
}

function ActionButton({
  ariaLabel,
  onClick,
  disabled,
  className,
  children,
}: {
  ariaLabel: string
  onClick: () => void
  disabled?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        // 48px+ touch target per mobile-first guidance
        'w-14 h-14 rounded-full border-2 shadow-md flex items-center justify-center transition-colors',
        'disabled:opacity-50 disabled:pointer-events-none',
        className,
      )}
    >
      {children}
    </motion.button>
  )
}
