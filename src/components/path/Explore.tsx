// Explore — "the constellation of possibilities."
// Browse-mode surface (renamed from Constellation). No completion pressure,
// no "next step" CTAs. Finite set per visit (8-12 cards), refreshable but
// NOT infinite. Research brief §6 + §7.

import { useCallback, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpenText,
  GraduationCap,
  MapPin,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { careers, type Career } from '@/data/constellationData'
import { businessOwners, type BusinessOwner } from '@/data/businessOwners'

type ExploreFilter = 'all' | 'careers' | 'mentors' | 'stories' | 'learning'
type ExploreCardType = 'career' | 'mentor' | 'story' | 'learning'

const FILTER_LABELS: Record<ExploreFilter, string> = {
  all: 'All',
  careers: 'Career paths',
  mentors: 'Mentors',
  stories: 'Stories',
  learning: 'Learning',
}

const CARDS_PER_VISIT = 10 // 8-12 range per research brief; lands in the middle

// Fabricated success stories. Anonymized per the PII rule: first name + age
// + one-line outcome only. Real stories will replace these once we have any.
interface StoryCard {
  id: string
  type: 'story'
  firstName: string
  age: number
  outcome: string
}

const STORY_POOL: StoryCard[] = [
  {
    id: 'story-1',
    type: 'story',
    firstName: 'Carlos',
    age: 17,
    outcome: 'Started as a weekend apprentice; now runs his own residential maintenance calls.',
  },
  {
    id: 'story-2',
    type: 'story',
    firstName: 'Mia',
    age: 16,
    outcome: 'Built a $300/mo recurring Instagram contract for a local bakery.',
  },
  {
    id: 'story-3',
    type: 'story',
    firstName: 'Bryce',
    age: 18,
    outcome: 'Stacked 5 mentor endorsements; got into a paid summer engineering program.',
  },
  {
    id: 'story-4',
    type: 'story',
    firstName: 'Sofia',
    age: 15,
    outcome: 'Tutored 4 neighbor kids in math; expanded to a small Saturday cohort.',
  },
  {
    id: 'story-5',
    type: 'story',
    firstName: 'Andre',
    age: 17,
    outcome: 'Apprenticed in two trades back-to-back; chose welding for his apprenticeship year.',
  },
]

// Fabricated learning modules. Real microcourse links go here once content
// lands.
interface LearningCard {
  id: string
  type: 'learning'
  title: string
  topic: string
  estimatedMinutes: number
}

const LEARNING_POOL: LearningCard[] = [
  {
    id: 'learn-1',
    type: 'learning',
    title: 'How to write a clear gig pitch',
    topic: 'Communication',
    estimatedMinutes: 12,
  },
  {
    id: 'learn-2',
    type: 'learning',
    title: 'Photo editing on a phone',
    topic: 'Creative',
    estimatedMinutes: 18,
  },
  {
    id: 'learn-3',
    type: 'learning',
    title: 'Reading a tape measure (no calculator)',
    topic: 'Trades',
    estimatedMinutes: 8,
  },
  {
    id: 'learn-4',
    type: 'learning',
    title: 'Getting a customer to leave a review',
    topic: 'Service',
    estimatedMinutes: 6,
  },
  {
    id: 'learn-5',
    type: 'learning',
    title: 'What "small business taxes" actually means',
    topic: 'Business',
    estimatedMinutes: 15,
  },
  {
    id: 'learn-6',
    type: 'learning',
    title: 'Saying no without burning the bridge',
    topic: 'Communication',
    estimatedMinutes: 10,
  },
]

interface ExploreProps {
  onCardAdded?: (cardType: ExploreCardType) => void
}

type AnyCard =
  | { kind: 'career'; data: Career }
  | { kind: 'mentor'; data: BusinessOwner }
  | { kind: 'story'; data: StoryCard }
  | { kind: 'learning'; data: LearningCard }

function shuffleSlice<T>(arr: T[], n: number): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out.slice(0, n)
}

function buildCardPool(filter: ExploreFilter): AnyCard[] {
  const pool: AnyCard[] = []
  if (filter === 'all' || filter === 'careers') {
    careers.forEach((c) => pool.push({ kind: 'career', data: c }))
  }
  if (filter === 'all' || filter === 'mentors') {
    businessOwners.forEach((m) => pool.push({ kind: 'mentor', data: m }))
  }
  if (filter === 'all' || filter === 'stories') {
    STORY_POOL.forEach((s) => pool.push({ kind: 'story', data: s }))
  }
  if (filter === 'all' || filter === 'learning') {
    LEARNING_POOL.forEach((l) => pool.push({ kind: 'learning', data: l }))
  }
  return pool
}

export default function Explore({ onCardAdded }: ExploreProps) {
  const [filter, setFilter] = useState<ExploreFilter>('all')
  // `nonce` bumps on refresh so the memoized shuffled set recomputes — gives
  // us deliberate re-rolls without infinite scroll.
  const [nonce, setNonce] = useState(0)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  const cards = useMemo(
    () => {
      const pool = buildCardPool(filter)
      return shuffleSlice(pool, Math.min(pool.length, CARDS_PER_VISIT))
    },
    // nonce is intentional — drives the re-roll on refresh click.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter, nonce],
  )

  const handleAdd = useCallback(
    (id: string, type: ExploreCardType) => {
      setAddedIds((prev) => {
        if (prev.has(id)) return prev
        const next = new Set(prev)
        next.add(id)
        return next
      })
      onCardAdded?.(type)
    },
    [onCardAdded],
  )

  return (
    <div className="space-y-5">
      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
        {(Object.keys(FILTER_LABELS) as ExploreFilter[]).map((f) => {
          const active = filter === f
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'shrink-0 px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-12',
                active
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
              )}
            >
              {FILTER_LABELS[f]}
            </button>
          )
        })}
      </div>

      {/* Grid of cards */}
      {cards.length === 0 ? (
        <p className="text-sm text-slate-500 italic">Nothing in that filter yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cards.map((c) => {
            const id =
              c.kind === 'career'
                ? c.data.id
                : c.kind === 'mentor'
                  ? c.data.id
                  : c.kind === 'story'
                    ? c.data.id
                    : c.data.id
            const added = addedIds.has(id)
            return (
              <ExploreCard
                key={`${c.kind}-${id}`}
                card={c}
                added={added}
                onAdd={() => handleAdd(id, c.kind)}
              />
            )
          })}
        </div>
      )}

      {/* Deliberate re-roll — NOT infinite scroll */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 min-h-12"
        >
          <RefreshCw className="w-4 h-4" />
          Show me different ones
        </button>
      </div>

      <p className="text-center text-[11px] text-slate-400">
        Finite by design. Take what catches your eye.
      </p>
    </div>
  )
}

function ExploreCard({
  card,
  added,
  onAdd,
}: {
  card: AnyCard
  added: boolean
  onAdd: () => void
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl bg-white border border-slate-200 p-4 hover:shadow-sm transition-all flex flex-col"
    >
      {card.kind === 'career' && <CareerCardBody data={card.data} />}
      {card.kind === 'mentor' && <MentorCardBody data={card.data} />}
      {card.kind === 'story' && <StoryCardBody data={card.data} />}
      {card.kind === 'learning' && <LearningCardBody data={card.data} />}

      <button
        type="button"
        onClick={onAdd}
        disabled={added}
        className={cn(
          'mt-3 inline-flex items-center gap-1 text-xs font-semibold self-start',
          added ? 'text-emerald-700' : 'text-indigo-600 hover:text-indigo-800',
        )}
      >
        {added ? (
          <>
            <Sparkles className="w-3 h-3" />
            Added to your path
          </>
        ) : (
          <>
            <Plus className="w-3 h-3" />
            Add to my path
          </>
        )}
      </button>
    </motion.div>
  )
}

function CardKind({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode
  label: string
  color: string
}) {
  return (
    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color }}>
      {icon}
      {label}
    </div>
  )
}

function CareerCardBody({ data }: { data: Career }) {
  return (
    <>
      <CardKind
        icon={<Star className="w-3 h-3" />}
        label="Career path"
        color="#7B61FF"
      />
      <h4 className="text-sm font-bold text-slate-900 leading-tight">{data.title}</h4>
      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{data.description}</p>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
        <span
          className="font-mono"
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
        >
          {data.avgSalary}
        </span>
        <span>·</span>
        <span>{data.growthRate}</span>
      </div>
    </>
  )
}

function MentorCardBody({ data }: { data: BusinessOwner }) {
  // First-name only per PII rule.
  const firstName = data.name.split(' ')[0]
  return (
    <>
      <CardKind
        icon={<Users className="w-3 h-3" />}
        label="Mentor"
        color="#22C8A9"
      />
      <h4 className="text-sm font-bold text-slate-900 leading-tight">
        {firstName} · {data.businessName}
      </h4>
      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{data.description}</p>
      <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
        <MapPin className="w-3 h-3" />
        {data.location.split(',').slice(-1)[0]?.trim() || data.location}
      </div>
    </>
  )
}

function StoryCardBody({ data }: { data: StoryCard }) {
  return (
    <>
      <CardKind
        icon={<Sparkles className="w-3 h-3" />}
        label="Story"
        color="#F97362"
      />
      <h4 className="text-sm font-bold text-slate-900 leading-tight">
        {data.firstName}, {data.age}
      </h4>
      <p className="text-xs text-slate-600 mt-1">{data.outcome}</p>
    </>
  )
}

function LearningCardBody({ data }: { data: LearningCard }) {
  return (
    <>
      <CardKind
        icon={<BookOpenText className="w-3 h-3" />}
        label="Learning"
        color="#0EA5E9"
      />
      <h4 className="text-sm font-bold text-slate-900 leading-tight">{data.title}</h4>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
        <GraduationCap className="w-3 h-3" />
        {data.topic}
        <span>·</span>
        <span>{data.estimatedMinutes} min</span>
      </div>
    </>
  )
}
