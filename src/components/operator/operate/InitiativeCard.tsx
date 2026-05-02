import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from 'lucide-react'
import type { Initiative } from '@/data/operatorInitiatives'
import { STAGE_COLORS, HEALTH_COLORS } from '@/data/operatorInitiatives'

interface InitiativeCardProps {
  initiative: Initiative
  onClick: () => void
}

const HEALTH_ICONS = {
  'on-track': CheckCircle,
  'at-risk': AlertTriangle,
  'blocked': AlertTriangle,
}

export default function InitiativeCard({ initiative, onClick }: InitiativeCardProps) {
  const HealthIcon = HEALTH_ICONS[initiative.health]
  const stageColor = STAGE_COLORS[initiative.stage]
  const healthColor = HEALTH_COLORS[initiative.health]

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 truncate">
            {initiative.title}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">{initiative.owner}</p>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{
            backgroundColor: `${healthColor}15`,
            color: healthColor,
          }}
        >
          <HealthIcon className="w-3 h-3" />
          {initiative.health.replace('-', ' ')}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 line-clamp-2 mb-3">
        {initiative.description}
      </p>

      {/* KPIs */}
      <div className="space-y-1.5 mb-3">
        {initiative.kpis.slice(0, 2).map((kpi, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-slate-500">{kpi.label}</span>
            <div className="flex items-center gap-1">
              <span className="font-medium text-slate-700">{kpi.current}</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-400">{kpi.target}</span>
              {kpi.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
              {kpi.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
              {kpi.trend === 'flat' && <Minus className="w-3 h-3 text-slate-400" />}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div
          className="px-2 py-0.5 rounded text-[10px] font-medium uppercase"
          style={{
            backgroundColor: `${stageColor}15`,
            color: stageColor,
          }}
        >
          {initiative.stage}
        </div>
        <span className="text-[10px] text-slate-400">
          Target: {new Date(initiative.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Blockers indicator */}
      {initiative.blockers.length > 0 && (
        <div className="mt-2 pt-2 border-t border-red-100">
          <div className="flex items-center gap-1 text-[10px] text-red-600">
            <AlertTriangle className="w-3 h-3" />
            {initiative.blockers.length} blocker{initiative.blockers.length > 1 ? 's' : ''}
          </div>
        </div>
      )}
    </motion.div>
  )
}
