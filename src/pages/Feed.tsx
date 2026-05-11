// Daily-bounded discovery surface.
//
// Research brief §7 — 5-8 cards per day, finite set, natural endpoint.
// No infinite scroll, no "load more," no auto-refresh. When the daily set is
// exhausted, surface the ExhaustedState component with the next refresh time
// and routes to Explore + Saved.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bookmark,
  Home,
  MessageSquare,
  Sparkles,
  Undo2,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSurveyStore } from '@/lib/surveyState'
import {
  computeMatchScore,
  getDailyCardCount,
  todayKey,
  type OpportunityCard as OpportunityCardData,
  type SwipeDirection,
} from '@/lib/feed/dailyFeed'
import { determineTrackFromBirth, type Track } from '@/lib/compliance'
import { useDailyFeedStore } from '@/lib/feed/dailyFeedStore'
import {
  trackFeedCardSwiped,
  trackFeedDayExhausted,
  trackFeedSessionNudgeShown,
} from '@/lib/track'
import { MOCK_OPPORTUNITY_CARDS } from '@/data/mockOpportunityCards'
import { kadeynProfile } from '@/data/kidProfile'
import SwipeStack from '@/components/feed/SwipeStack'
import ExhaustedState from '@/components/feed/ExhaustedState'
import SessionTimerHook from '@/components/feed/SessionTimerHook'

// V1 active-gig signal — we don't yet have a real "in-progress gig" model;
// the modifier is plumbed via getDailyCardCount but we leave hasActiveGig
// false for the prototype.
const HAS_ACTIVE_GIG = false

function resolveTrack(): Track {
  const answers = useSurveyStore.getState().answers

  if (answers.trackOverride) return answers.trackOverride

  const derived = determineTrackFromBirth(answers.birthMonth, answers.birthYear)
  if (derived && derived.allowed) return derived.track

  if (import.meta.env.DEV) {
    console.warn('[Feed] Track not resolvable from survey state; defaulting to "builder".')
  }
  return 'builder'
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function buildTodaysCards(track: Track): OpportunityCardData[] {
  const count = getDailyCardCount(track, HAS_ACTIVE_GIG)
  const interests = kadeynProfile.interests
  const skills = kadeynProfile.skills.map((s) => s.name)

  // Score every mock card against the kid's interests/skills, sort by score,
  // then take the top `count * 2` and shuffle the head — produces a daily
  // set that's still recommendation-shaped without being deterministic.
  const scored = MOCK_OPPORTUNITY_CARDS.map((c) => ({
    ...c,
    matchScore: computeMatchScore(c, interests, skills),
  })).sort((a, b) => b.matchScore - a.matchScore)

  return shuffle(scored.slice(0, count * 2)).slice(0, count)
}

export default function Feed() {
  const track = useMemo(() => resolveTrack(), [])
  const today = useMemo(() => todayKey(), [])

  // Subscribe to RAW state only. Selecting via methods that return new
  // arrays / call store-mutating actions causes React-snapshot infinite
  // loops (zustand discussion #2200). Action references are stable, so
  // selecting them is fine.
  const setsByDate = useDailyFeedStore((s) => s.setsByDate)
  const recordSwipe = useDailyFeedStore((s) => s.recordSwipe)
  const undoLastSwipe = useDailyFeedStore((s) => s.undoLastSwipe)

  // Initialize today's set imperatively via the action — never inside a
  // selector. Idempotent: the action early-returns if today already exists.
  useEffect(() => {
    useDailyFeedStore
      .getState()
      .getOrCreateTodaySet(today, () => buildTodaysCards(track))
  }, [today, track])

  // Derived state. `set` is a stable reference from setsByDate until the
  // store actually mutates. `remaining` is useMemo'd so the .filter() result
  // doesn't allocate a new array on every render.
  const set = setsByDate[today]
  const remaining = useMemo(
    () =>
      set ? set.cards.filter((c) => set.statusByCardId[c.id] === 'unseen') : [],
    [set],
  )
  const isExhausted = set?.exhausted ?? false

  // Transient undo affordance: shows for 4 seconds after each swipe.
  const [undoVisibleUntil, setUndoVisibleUntil] = useState<number | null>(null)
  const showUndo = undoVisibleUntil !== null && undoVisibleUntil > Date.now()

  // Guard so we fire the day-exhausted event exactly once per session even
  // if React re-renders or the user navigates back to /app/feed.
  const exhaustedFiredRef = useRef(false)

  const handleSwipe = useCallback(
    (cardId: string, direction: SwipeDirection) => {
      const card = set?.cards.find((c) => c.id === cardId)
      if (card) {
        trackFeedCardSwiped(direction, card.category, card.matchScore)
      }
      recordSwipe(cardId, direction)
      const expiresAt = Date.now() + 4000
      setUndoVisibleUntil(expiresAt)
      setTimeout(() => {
        // Race-safe: only hide if this same expiry is still the active one.
        setUndoVisibleUntil((current) => (current === expiresAt ? null : current))
      }, 4100)
    },
    [recordSwipe, set],
  )

  // Fire day-exhausted exactly once per day on the false→true transition.
  useEffect(() => {
    if (!isExhausted || !set || exhaustedFiredRef.current) return
    exhaustedFiredRef.current = true
    const statuses = Object.values(set.statusByCardId)
    const interested = statuses.filter((s) => s === 'interested').length
    const saved = statuses.filter((s) => s === 'saved').length
    const declined = statuses.filter((s) => s === 'declined').length
    trackFeedDayExhausted(set.cards.length, interested, saved, declined)
  }, [isExhausted, set])

  const handleUndo = useCallback(() => {
    undoLastSwipe(today)
    setUndoVisibleUntil(null)
  }, [undoLastSwipe, today])

  // While the init effect populates today's set we render no counter.
  const total = set?.cards.length ?? 0
  const seen = total - remaining.length

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-semibold tracking-tight text-slate-900">Today</span>
          </div>
          <div className="text-xs text-slate-500">
            {!set ? null : isExhausted ? (
              <span className="font-medium text-emerald-700">Done · refresh tomorrow</span>
            ) : (
              <>
                <span
                  className="font-semibold text-slate-900"
                  style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                >
                  {seen + 1}
                </span>{' '}
                of {total}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {!set ? null : isExhausted ? (
          <ExhaustedState set={set} />
        ) : (
          <SwipeStack cards={remaining} track={track} onSwipe={handleSwipe} />
        )}
      </main>

      {/* Transient undo affordance */}
      <AnimatePresence>
        {showUndo && !isExhausted && (
          <motion.button
            type="button"
            onClick={handleUndo}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-lg"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Undo
          </motion.button>
        )}
      </AnimatePresence>

      <SessionTimerHook
        active={!isExhausted}
        onShown={trackFeedSessionNudgeShown}
      />

      <BottomNav />
    </div>
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
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors',
                // 48px+ touch target
                'min-w-12 min-h-12',
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
