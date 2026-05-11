// Lightweight session timer — surfaces a break suggestion after 15 minutes
// of continuous-use time. Prompt 5 will wire this hook into the AI-aware
// pacing layer; this is the V1 visible-nudge-only scaffold.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const NUDGE_AT_MINUTES = 15
const DISMISS_REPEAT_MINUTES = 10

interface Props {
  active: boolean // Pass true while the feed is being interacted with
  onShown?: (elapsedMinutes: number) => void
}

export default function SessionTimerHook({ active, onShown }: Props) {
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [showNudge, setShowNudge] = useState(false)
  const [dismissedAt, setDismissedAt] = useState<number | null>(null)
  const navigate = useNavigate()

  // Start the timer on mount-while-active; clear it when active goes false.
  useEffect(() => {
    if (active && !startedAt) {
      setStartedAt(Date.now())
    } else if (!active) {
      setStartedAt(null)
      setShowNudge(false)
    }
  }, [active, startedAt])

  // Poll every 30s for the elapsed-time threshold. Lightweight; 30s gives
  // ~timely UX without burning battery.
  useEffect(() => {
    if (!startedAt) return

    const check = () => {
      const elapsedMin = (Date.now() - startedAt) / 60_000
      const dismissedMinAgo = dismissedAt ? (Date.now() - dismissedAt) / 60_000 : Infinity
      if (elapsedMin >= NUDGE_AT_MINUTES && dismissedMinAgo >= DISMISS_REPEAT_MINUTES) {
        setShowNudge(true)
        onShown?.(elapsedMin)
      }
    }

    const interval = setInterval(check, 30_000)
    return () => clearInterval(interval)
  }, [startedAt, dismissedAt, onShown])

  const dismiss = (takeBreak: boolean) => {
    setShowNudge(false)
    setDismissedAt(Date.now())
    if (takeBreak) navigate('/')
  }

  return (
    <AnimatePresence>
      {showNudge && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          role="dialog"
          aria-live="polite"
          className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl bg-slate-900 p-4 text-white shadow-2xl"
        >
          <div className="text-sm font-semibold">You've been browsing for a while.</div>
          <div className="text-xs text-white/70 mt-1">
            Want to take a break, or check a mentor message?
          </div>
          <div className="flex gap-2 mt-3 items-center">
            <button
              type="button"
              onClick={() => dismiss(false)}
              className="text-xs font-semibold text-white/90 hover:text-white px-3 py-2 rounded-lg"
            >
              Keep going
            </button>
            <button
              type="button"
              onClick={() => dismiss(true)}
              className="ml-auto text-xs font-semibold text-white px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              Take a break
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
