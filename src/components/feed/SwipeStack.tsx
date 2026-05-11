import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
  type TargetAndTransition,
} from 'framer-motion'
import type { Track } from '@/lib/compliance'
import type { OpportunityCard as OpportunityCardData, SwipeDirection } from '@/lib/feed/dailyFeed'
import OpportunityCard, { CardActionButtons, CardSwipeOverlays } from './OpportunityCard'

interface SwipeStackProps {
  cards: OpportunityCardData[] // The remaining (unseen) cards
  track: Track
  onSwipe: (cardId: string, direction: SwipeDirection) => void
}

// Velocity and offset thresholds for committing a swipe. Tuned to feel
// "decisive on intent, forgiving on accident" — a light tap-drag won't
// commit, but a confident flick will.
const COMMIT_OFFSET = 110 // px
const COMMIT_VELOCITY = 500 // px/s

// 200ms transition cooldown between cards. The deliberate friction that
// turns scrolling-feel into deciding-feel (research brief §7).
const COOLDOWN_MS = 200

const EXIT_TARGETS: Record<SwipeDirection, TargetAndTransition> = {
  right: { x: 600, opacity: 0, rotate: 25, transition: { duration: 0.25 } },
  left: { x: -600, opacity: 0, rotate: -25, transition: { duration: 0.25 } },
  up: { y: -700, opacity: 0, transition: { duration: 0.25 } },
}

const DEFAULT_EXIT: TargetAndTransition = EXIT_TARGETS.left

export default function SwipeStack({ cards, track, onSwipe }: SwipeStackProps) {
  const [coolingDown, setCoolingDown] = useState(false)
  const [pendingExit, setPendingExit] = useState<TargetAndTransition>(DEFAULT_EXIT)
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Top card's drag motion values
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])

  const topCard = cards[0]
  const underCard = cards[1] // Faintly visible behind the top card

  // Clear any pending cooldown timer when the component unmounts.
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current)
    }
  }, [])

  const commit = useCallback(
    (cardId: string, direction: SwipeDirection) => {
      if (coolingDown) return
      setCoolingDown(true)
      setPendingExit(EXIT_TARGETS[direction])
      onSwipe(cardId, direction)
      // Reset motion values for the next top card.
      x.set(0)
      y.set(0)
      cooldownTimerRef.current = setTimeout(() => {
        setCoolingDown(false)
        cooldownTimerRef.current = null
      }, COOLDOWN_MS)
    },
    [coolingDown, onSwipe, x, y],
  )

  const handleDragEnd = useCallback(
    (_event: unknown, info: PanInfo) => {
      if (!topCard) return
      const offsetX = info.offset.x
      const offsetY = info.offset.y
      const velocityX = info.velocity.x
      const velocityY = info.velocity.y

      // Up wins over horizontal when the gesture is dominantly vertical.
      const verticalDominant = Math.abs(offsetY) > Math.abs(offsetX) * 1.2
      if (verticalDominant && (offsetY < -COMMIT_OFFSET || velocityY < -COMMIT_VELOCITY)) {
        commit(topCard.id, 'up')
        return
      }
      if (offsetX > COMMIT_OFFSET || velocityX > COMMIT_VELOCITY) {
        commit(topCard.id, 'right')
        return
      }
      if (offsetX < -COMMIT_OFFSET || velocityX < -COMMIT_VELOCITY) {
        commit(topCard.id, 'left')
        return
      }
      // Under threshold — snap back.
      x.set(0)
      y.set(0)
    },
    [commit, topCard, x, y],
  )

  if (!topCard) return null

  return (
    <div className="space-y-5">
      <div
        className="relative w-full mx-auto"
        // Reserve vertical space so the stack doesn't reflow when the top
        // card exits. ~480px is a comfortable card height on a phone.
        style={{ minHeight: 480, maxWidth: 380 }}
      >
        {/* Under-stack card — slightly behind, smaller, non-interactive */}
        {underCard && (
          <div
            className="absolute inset-0 origin-bottom"
            style={{ transform: 'scale(0.96) translateY(10px)', opacity: 0.7, zIndex: 1 }}
            aria-hidden
          >
            <OpportunityCard card={underCard} track={track} />
          </div>
        )}

        {/* Top card with drag + AnimatePresence exit */}
        <AnimatePresence custom={x} initial={false}>
          <motion.div
            key={topCard.id}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{ x, y, rotate, zIndex: 2 }}
            drag={!coolingDown}
            dragElastic={0.6}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={pendingExit}
            whileTap={{ cursor: 'grabbing' }}
          >
            <CardSwipeOverlays x={x} y={y} />
            <OpportunityCard card={topCard} track={track} />
          </motion.div>
        </AnimatePresence>
      </div>

      <CardActionButtons
        onDecline={() => commit(topCard.id, 'left')}
        onSave={() => commit(topCard.id, 'up')}
        onAccept={() => commit(topCard.id, 'right')}
        disabled={coolingDown}
      />
    </div>
  )
}
