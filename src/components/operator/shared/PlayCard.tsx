import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Play } from '@/data/operatorRoadmapData'

interface PlayCardProps {
  play: Play
  color: string
  onClick?: () => void
}

const STATUS_ICONS = {
  'Not Started': Circle,
  'In Progress': Clock,
  'Completed': CheckCircle2,
}

const EFFORT_COLORS = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-red-100 text-red-700',
}

export default function PlayCard({ play, color, onClick }: PlayCardProps) {
  const StatusIcon = STATUS_ICONS[play.status]

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-slate-200 p-4 cursor-pointer',
        'hover:border-slate-300 hover:shadow-sm transition-all'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium text-slate-900">{play.title}</span>
        </div>
        <StatusIcon
          className={cn(
            'w-4 h-4',
            play.status === 'Completed' && 'text-emerald-500',
            play.status === 'In Progress' && 'text-amber-500',
            play.status === 'Not Started' && 'text-slate-300'
          )}
        />
      </div>

      <p className="text-xs text-slate-600 line-clamp-2 mb-3">{play.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'px-2 py-0.5 rounded text-[10px] font-medium',
              EFFORT_COLORS[play.effort]
            )}
          >
            {play.effort}
          </span>
          <span className="text-[10px] text-slate-400">{play.timeline}</span>
        </div>
        <span className="text-xs font-medium" style={{ color }}>
          {play.impact}
        </span>
      </div>
    </motion.div>
  )
}
