// Zustand store for the bounded daily feed. State is keyed by date so
// yesterday's swipes never bleed into today, and a 7-day rolling garbage
// collector trims old entries on rehydrate. localStorage in V1; swap for a
// server-side persisted set when authenticated kid accounts ship.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getNextRefreshTime,
  type CardStatus,
  type DailySet,
  type OpportunityCard,
  type SwipeDirection,
} from './dailyFeed'

interface DailyFeedState {
  setsByDate: Record<string, DailySet>
  getOrCreateTodaySet: (today: string, generator: () => OpportunityCard[]) => DailySet
  recordSwipe: (cardId: string, direction: SwipeDirection) => void
  undoLastSwipe: (today: string) => void
  isExhausted: (today: string) => boolean
  getRemainingCards: (today: string) => OpportunityCard[]
}

const SWIPE_TO_STATUS: Record<SwipeDirection, CardStatus> = {
  right: 'interested',
  left: 'declined',
  up: 'saved',
}

// Persisted lightweight swipe log for the undo affordance. Lives outside the
// per-day map so we can pop the last entry without scanning every card.
type SwipeEntry = { date: string; cardId: string; previousStatus: CardStatus }

interface InternalState extends DailyFeedState {
  swipeHistory: SwipeEntry[]
}

export const useDailyFeedStore = create<InternalState>()(
  persist(
    (set, get) => ({
      setsByDate: {},
      swipeHistory: [],

      getOrCreateTodaySet: (today, generator) => {
        const existing = get().setsByDate[today]
        if (existing) return existing

        const cards = generator()
        const newSet: DailySet = {
          date: today,
          cards,
          statusByCardId: Object.fromEntries(
            cards.map((c) => [c.id, 'unseen' as CardStatus]),
          ),
          // Pass an empty timezone; V2 plumbs the kid's IANA zone here.
          nextRefreshAt: getNextRefreshTime(''),
          exhausted: cards.length === 0,
        }
        set((state) => ({ setsByDate: { ...state.setsByDate, [today]: newSet } }))
        return newSet
      },

      recordSwipe: (cardId, direction) => {
        const today = (() => {
          const d = new Date()
          const y = d.getFullYear()
          const m = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          return `${y}-${m}-${day}`
        })()

        set((state) => {
          const todaySet = state.setsByDate[today]
          if (!todaySet) return state
          const previousStatus = todaySet.statusByCardId[cardId] ?? 'unseen'
          if (previousStatus !== 'unseen') return state // No-op on duplicate

          const newStatus = {
            ...todaySet.statusByCardId,
            [cardId]: SWIPE_TO_STATUS[direction],
          }
          const allActedOn = Object.values(newStatus).every((s) => s !== 'unseen')

          return {
            setsByDate: {
              ...state.setsByDate,
              [today]: { ...todaySet, statusByCardId: newStatus, exhausted: allActedOn },
            },
            swipeHistory: [...state.swipeHistory, { date: today, cardId, previousStatus }],
          }
        })
      },

      undoLastSwipe: (today) => {
        set((state) => {
          // Find the most recent history entry for today.
          for (let i = state.swipeHistory.length - 1; i >= 0; i--) {
            const entry = state.swipeHistory[i]
            if (entry.date !== today) continue
            const todaySet = state.setsByDate[today]
            if (!todaySet) return state
            const restored = {
              ...todaySet.statusByCardId,
              [entry.cardId]: entry.previousStatus,
            }
            const allActedOn = Object.values(restored).every((s) => s !== 'unseen')
            const newHistory = [...state.swipeHistory.slice(0, i), ...state.swipeHistory.slice(i + 1)]
            return {
              setsByDate: {
                ...state.setsByDate,
                [today]: { ...todaySet, statusByCardId: restored, exhausted: allActedOn },
              },
              swipeHistory: newHistory,
            }
          }
          return state
        })
      },

      isExhausted: (today) => {
        return get().setsByDate[today]?.exhausted ?? false
      },

      getRemainingCards: (today) => {
        const todaySet = get().setsByDate[today]
        if (!todaySet) return []
        return todaySet.cards.filter((c) => todaySet.statusByCardId[c.id] === 'unseen')
      },
    }),
    {
      name: 'sparklocal-daily-feed',
      // Garbage-collect entries older than 7 days on rehydrate so the
      // localStorage payload doesn't grow forever. Direct mutation here is
      // the documented zustand-persist pattern — runs synchronously before
      // subscribers fire, never re-enters render.
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - 7)
        const y = cutoff.getFullYear()
        const m = String(cutoff.getMonth() + 1).padStart(2, '0')
        const day = String(cutoff.getDate()).padStart(2, '0')
        const cutoffStr = `${y}-${m}-${day}`
        // Defensive: persisted data from before swipeHistory existed has no
        // such field; default to [] before filtering.
        state.setsByDate = Object.fromEntries(
          Object.entries(state.setsByDate ?? {}).filter(([date]) => date >= cutoffStr),
        )
        state.swipeHistory = (state.swipeHistory ?? []).filter((e) => e.date >= cutoffStr)
      },
    },
  ),
)
