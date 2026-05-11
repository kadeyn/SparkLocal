import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Rocket } from 'lucide-react'
import { track } from '@/lib/track'
import { initiatives, type Initiative, type InitiativeStage, STAGE_COLORS } from '@/data/operatorInitiatives'
import { DemoDataBanner } from '../shared'
import InitiativeCard from './InitiativeCard'
import InitiativeDeepDive from './InitiativeDeepDive'

const STAGES: { id: InitiativeStage; label: string }[] = [
  { id: 'idea', label: 'Idea' },
  { id: 'planning', label: 'Planning' },
  { id: 'pilot', label: 'Pilot' },
  { id: 'scaling', label: 'Scaling' },
  { id: 'completed', label: 'Completed' },
]

export default function InitiativesView() {
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null)

  const handleOpenInitiative = (initiative: Initiative) => {
    track('operator_initiative_opened', {
      initiativeId: initiative.id,
      stage: initiative.stage,
      health: initiative.health,
    })
    setSelectedInitiative(initiative)
  }

  const getInitiativesByStage = (stage: InitiativeStage): Initiative[] => {
    return initiatives.filter((i) => i.stage === stage)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Initiative Pipeline</h1>
            <p className="text-sm text-slate-500">Track progress across strategic initiatives</p>
          </div>
        </div>
        <DemoDataBanner />
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const stageInitiatives = getInitiativesByStage(stage.id)
          const color = STAGE_COLORS[stage.id]

          return (
            <div key={stage.id} className="flex flex-col">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium text-slate-900">{stage.label}</span>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${color}15`,
                    color: color,
                  }}
                >
                  {stageInitiatives.length}
                </span>
              </div>

              {/* Column Content */}
              <div className="flex-1 space-y-3 min-h-[400px] bg-slate-50/50 rounded-xl p-3">
                {stageInitiatives.map((initiative) => (
                  <InitiativeCard
                    key={initiative.id}
                    initiative={initiative}
                    onClick={() => handleOpenInitiative(initiative)}
                  />
                ))}

                {stageInitiatives.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-sm text-slate-400">
                    No initiatives
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Deep Dive Modal */}
      <AnimatePresence>
        {selectedInitiative && (
          <InitiativeDeepDive
            initiative={selectedInitiative}
            onClose={() => setSelectedInitiative(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
