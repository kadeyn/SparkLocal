// Path — kid's weekly/post-gig surface.
//
// Restructured per research brief §6:
//   Old: Skill Tree | Constellation | Future  (three tabs)
//   New: My Path | Explore                    (two tabs)
//
// My Path absorbs Skill Tree + Future. Explore is the renamed Constellation.
// Legacy components remain on disk marked @deprecated for one release cycle.

import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bookmark,
  Compass,
  Home,
  MessageSquare,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { kadeynProfile } from '@/data/kidProfile'
import {
  trackMyPathNextStepClicked,
  trackPathExploreCardAdded,
  trackPathTabViewed,
} from '@/lib/track'
import MyPath from '@/components/path/MyPath'
import Explore from '@/components/path/Explore'

type PathTab = 'mypath' | 'explore'

const TAB_LABELS: Record<PathTab, string> = {
  mypath: 'My Path',
  explore: 'Explore',
}

const TOOLTIP_STORAGE_KEY = 'sparklocal-path-tooltip-seen'

// Default-tab heuristic — research brief §6: kids who have done work want to
// see their progress; kids who haven't want to look around.
function inferDefaultTab(): PathTab {
  return kadeynProfile.completedJobs.length > 0 ? 'mypath' : 'explore'
}

export default function Path() {
  const [searchParams, setSearchParams] = useSearchParams()
  const defaultTab = useMemo(() => inferDefaultTab(), [])
  const currentTab = (searchParams.get('tab') as PathTab) || defaultTab
  const [tooltipOpen, setTooltipOpen] = useState(false)

  // Show the 20-second explainer tooltip on first visit only.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem(TOOLTIP_STORAGE_KEY)) {
      setTooltipOpen(true)
    }
  }, [])

  // Tab-view analytics — fires on initial render and every tab change.
  useEffect(() => {
    trackPathTabViewed(currentTab)
  }, [currentTab])

  const handleTabChange = (tab: PathTab) => {
    setSearchParams({ tab })
  }

  const dismissTooltip = () => {
    setTooltipOpen(false)
    try {
      localStorage.setItem(TOOLTIP_STORAGE_KEY, '1')
    } catch {
      /* private mode etc — fine to drop */
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header — kid identity */}
        <header className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-indigo-200">
              <AvatarImage src={kadeynProfile.avatar} />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-base font-bold">
                {kadeynProfile.firstName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-bold leading-tight">{kadeynProfile.firstName}</h1>
              <p className="text-xs text-muted-foreground">
                {kadeynProfile.age} · Mobile, AL
              </p>
            </div>
          </div>
        </header>

        {/* Tab segmented control */}
        <div
          className="flex p-1 bg-slate-100 rounded-full mb-6 sticky top-3 z-30 backdrop-blur"
          role="tablist"
          aria-label="Path views"
        >
          {(Object.keys(TAB_LABELS) as PathTab[]).map((tab) => {
            const active = currentTab === tab
            const Icon = tab === 'mypath' ? TrendingUp : Compass
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={active}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-12',
                  active
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                <Icon className="w-4 h-4" />
                {TAB_LABELS[tab]}
              </button>
            )
          })}
        </div>

        {/* Active tab body */}
        <AnimatePresence mode="wait">
          {currentTab === 'mypath' ? (
            <motion.div
              key="mypath"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MyPath
                kidId={kadeynProfile.id}
                onNextStepClicked={trackMyPathNextStepClicked}
              />
            </motion.div>
          ) : (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Explore onCardAdded={trackPathExploreCardAdded} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {tooltipOpen && <FirstVisitTooltip onDismiss={dismissTooltip} />}
      </AnimatePresence>

      <BottomNav />
    </div>
  )
}

function FirstVisitTooltip({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      role="dialog"
      aria-modal="false"
      className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-md rounded-2xl bg-slate-900 text-white p-4 shadow-2xl"
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="text-sm font-semibold mb-2">Two surfaces here:</div>
      <ul className="text-xs text-white/85 space-y-1.5">
        <li>
          <span className="font-semibold">My Path</span> — where you see your growth and pick your
          next step.
        </li>
        <li>
          <span className="font-semibold">Explore</span> — where you look around at what else is
          out there.
        </li>
      </ul>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-3 text-xs font-semibold text-white px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
      >
        Got it
      </button>
    </motion.div>
  )
}

function BottomNav() {
  const location = useLocation()
  const items = [
    { path: '/app/feed', icon: Home, label: 'Feed' },
    { path: '/app/saved', icon: Bookmark, label: 'Saved' },
    { path: '/app/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/app/path', icon: Sparkles, label: 'Path' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {items.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              aria-label={label}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors min-w-12 min-h-12',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
