import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  Clock,
  ShieldCheck,
  Star,
  Users,
  X,
} from 'lucide-react'
import { track } from '@/lib/track'
import { cn } from '@/lib/utils'
import {
  ownerPipeline,
  PIPELINE_STAGE_COLORS,
  PIPELINE_STAGE_LABELS,
  type KidCandidate,
  type PipelineStage,
} from '@/data/ownerPipeline'
import { DemoDataBanner } from '../operator/shared'

const STAGES: PipelineStage[] = ['matched', 'engaged', 'active', 'completed']

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const hours = Math.round(diffMs / 3_600_000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

function PipelineCard({ kid, onClick, selected }: { kid: KidCandidate; onClick: () => void; selected: boolean }) {
  const color = PIPELINE_STAGE_COLORS[kid.stage]

  return (
    <motion.button
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'w-full text-left bg-white rounded-xl border p-4 cursor-pointer transition-all',
        selected ? 'border-emerald-500 shadow-md ring-2 ring-emerald-200' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{kid.name}</h4>
            <span className="text-[10px] text-slate-400">·</span>
            <span className="text-xs text-slate-500">age {kid.age}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {kid.interests.slice(0, 3).map((interest) => (
              <span key={interest} className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                {interest}
              </span>
            ))}
          </div>
        </div>
        <div
          className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {kid.matchScore}
        </div>
      </div>

      {kid.parentApproved ? (
        <div className="flex items-center gap-1 text-[10px] text-emerald-600 mb-2">
          <ShieldCheck className="w-3 h-3" />
          Parent approved
        </div>
      ) : (
        <div className="flex items-center gap-1 text-[10px] text-amber-600 mb-2">
          <Clock className="w-3 h-3" />
          Parent approval pending
        </div>
      )}

      {kid.hoursLogged !== undefined && (
        <div className="flex items-center justify-between text-xs text-slate-600 mt-2 pt-2 border-t border-slate-100">
          <span className="font-mono">{kid.hoursLogged}h logged</span>
          <span className="font-mono text-emerald-700">${kid.totalEarned?.toLocaleString()}</span>
        </div>
      )}

      {kid.rating !== undefined && (
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'w-3 h-3',
                i < (kid.rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
              )}
            />
          ))}
        </div>
      )}

      {kid.pendingAction && (
        <div className="mt-2 pt-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-700">
            <span className="text-slate-400 mr-1">Next:</span>
            {kid.pendingAction}
          </p>
        </div>
      )}

      <div className="text-[10px] text-slate-400 mt-2">{timeAgo(kid.lastActivity)}</div>
    </motion.button>
  )
}

function KidDetailPanel({ kid, onClose }: { kid: KidCandidate; onClose: () => void }) {
  const color = PIPELINE_STAGE_COLORS[kid.stage]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  {PIPELINE_STAGE_LABELS[kid.stage]}
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded font-mono font-semibold"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  {kid.matchScore} match
                </span>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">{kid.name}</h2>
              <p className="text-sm text-slate-500 mt-1">Age {kid.age}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Interests</p>
            <div className="flex flex-wrap gap-1.5">
              {kid.interests.map((i) => (
                <span key={i} className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-700">
                  {i}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {kid.parentApproved ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-700">Parent approved</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-slate-700">Parent approval pending</span>
              </>
            )}
          </div>

          {kid.hoursLogged !== undefined && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <p
                  className="text-lg font-semibold text-slate-900"
                  style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                >
                  {kid.hoursLogged}h
                </p>
                <p className="text-xs text-slate-500">Hours logged</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p
                  className="text-lg font-semibold text-emerald-700"
                  style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                >
                  ${kid.totalEarned?.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">Total earned</p>
              </div>
            </div>
          )}

          {kid.rating !== undefined && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < (kid.rating ?? 0) ? 'fill-amber-500 text-amber-500' : 'text-slate-300'
                    )}
                  />
                ))}
              </div>
              {kid.ratingNote && <p className="text-sm text-slate-700">{kid.ratingNote}</p>}
            </div>
          )}

          {kid.pendingAction && kid.stage !== 'completed' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                Next action
              </p>
              <p className="text-sm text-slate-700">{kid.pendingAction}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function PipelineView() {
  const [selectedKid, setSelectedKid] = useState<KidCandidate | null>(null)

  const handleOpen = (kid: KidCandidate) => {
    track('owner_pipeline_kid_opened', { kidId: kid.id, stage: kid.stage })
    setSelectedKid(kid)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Candidate Pipeline</h1>
            <p className="text-sm text-slate-500">
              {ownerPipeline.length} kids across 4 stages · click a card to dig in
            </p>
          </div>
        </div>
        <DemoDataBanner />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const kids = ownerPipeline.filter((k) => k.stage === stage)
          const color = PIPELINE_STAGE_COLORS[stage]

          return (
            <div key={stage} className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm font-medium text-slate-900">
                    {PIPELINE_STAGE_LABELS[stage]}
                  </span>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  {kids.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 min-h-[400px] bg-slate-50/50 rounded-xl p-3">
                {kids.map((kid) => (
                  <PipelineCard
                    key={kid.id}
                    kid={kid}
                    onClick={() => handleOpen(kid)}
                    selected={selectedKid?.id === kid.id}
                  />
                ))}

                {kids.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-sm text-slate-400">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {selectedKid && <KidDetailPanel kid={selectedKid} onClose={() => setSelectedKid(null)} />}
      </AnimatePresence>
    </div>
  )
}
