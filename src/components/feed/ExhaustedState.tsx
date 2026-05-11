import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Bookmark, CheckCircle2, Compass, Heart, X } from 'lucide-react'
import { BrandGradient } from '@/components/brand'
import { Button } from '@/components/ui/button'
import type { DailySet } from '@/lib/feed/dailyFeed'

interface ExhaustedStateProps {
  set: DailySet
  onReviewToday?: () => void
}

function formatNextRefresh(iso: string): string {
  const next = new Date(iso)
  const now = new Date()
  const isTomorrow =
    next.getDate() !== now.getDate() ||
    next.getMonth() !== now.getMonth() ||
    next.getFullYear() !== now.getFullYear()
  const time = next.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return isTomorrow ? `tomorrow at ${time}` : `today at ${time}`
}

export default function ExhaustedState({ set, onReviewToday }: ExhaustedStateProps) {
  const total = set.cards.length
  const statuses = Object.values(set.statusByCardId)
  const interested = statuses.filter((s) => s === 'interested').length
  const saved = statuses.filter((s) => s === 'saved').length
  const declined = statuses.filter((s) => s === 'declined').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-md mx-auto px-4 py-10 text-center"
    >
      <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        That's <BrandGradient>everyone</BrandGradient> for today.
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        You saw {total} {total === 1 ? 'opportunity' : 'opportunities'}. Your next batch arrives{' '}
        {formatNextRefresh(set.nextRefreshAt)}.
      </p>

      {/* Tally chips */}
      <div className="mt-6 grid grid-cols-3 gap-2">
        <Tally icon={<Heart className="w-3.5 h-3.5 text-emerald-600 fill-current" />} count={interested} label="Interested" />
        <Tally icon={<Bookmark className="w-3.5 h-3.5 text-amber-600" />} count={saved} label="Saved" />
        <Tally icon={<X className="w-3.5 h-3.5 text-slate-500" />} count={declined} label="Not now" />
      </div>

      {/* CTAs */}
      <div className="mt-8 space-y-2">
        <Button
          asChild
          className="w-full bg-gradient-to-r from-indigo-600 to-rose-500 hover:from-indigo-500 hover:to-rose-400 text-white font-semibold h-12"
        >
          <Link to="/app/path?tab=explore">
            <Compass className="w-4 h-4 mr-2" />
            Explore other paths
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full h-12">
          <Link to="/app/saved">
            <Bookmark className="w-4 h-4 mr-2" />
            See your saved
          </Link>
        </Button>
      </div>

      {onReviewToday && (
        <button
          type="button"
          onClick={onReviewToday}
          className="mt-5 text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2"
        >
          Review today's decisions
        </button>
      )}

      <p className="mt-6 text-[11px] text-slate-400">
        No "load more." That's intentional. Your time today is yours back.
      </p>
    </motion.div>
  )
}

function Tally({ icon, count, label }: { icon: React.ReactNode; count: number; label: string }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 px-2 py-2">
      <div className="flex items-center justify-center gap-1">
        {icon}
        <span
          className="text-base font-bold text-slate-900"
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
        >
          {count}
        </span>
      </div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-0.5">
        {label}
      </div>
    </div>
  )
}
