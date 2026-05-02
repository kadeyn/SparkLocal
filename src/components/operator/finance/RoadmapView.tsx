import { useState } from 'react'
import { motion } from 'framer-motion'
import { Map, Sparkles, CheckCircle2, Clock, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { callAI, type AIError } from '@/lib/ai'
import { track } from '@/lib/track'
import {
  roadmapVectors,
  type VectorType,
  type Vector,
} from '@/data/operatorRoadmapData'
import { DemoDataBanner, BriefingPanel, PlayCard, DemoModePlaceholder } from '../shared'

interface AISynthesis {
  summary: string
  priorityPlay: string
  reasoning: string
  risks: string[]
  dependencies: string[]
}

export default function RoadmapView() {
  const [selectedVector, setSelectedVector] = useState<VectorType>('organic')
  const [synthesis, setSynthesis] = useState<AISynthesis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AIError | null>(null)
  const [hasGenerated, setHasGenerated] = useState(false)

  const isDemoMode = import.meta.env.VITE_AI_DEMO_MODE === 'true'
  const currentVector = roadmapVectors.find((v) => v.id === selectedVector)!

  const generateSynthesis = async (bypassCache = false) => {
    if (isDemoMode) return

    setLoading(true)
    setError(null)
    track('operator_ai_synthesis_regenerated', { module: 'roadmap' })

    try {
      const result = await callAI({
        system: `You are a growth strategy advisor for SparkLocal, a youth entrepreneurship marketplace. Analyze the growth vector and its plays to provide strategic synthesis.

Respond in JSON format:
{
  "summary": "2-3 sentence synthesis of the vector's current state and opportunity",
  "priorityPlay": "The play ID that should be prioritized next",
  "reasoning": "Why this play should be prioritized",
  "risks": ["risk 1", "risk 2"],
  "dependencies": ["dependency 1", "dependency 2"]
}`,
        prompt: `Analyze the ${currentVector.label} growth vector:

Description: ${currentVector.description}

Plays:
${currentVector.plays.map((p) => `
- ${p.title} (${p.status})
  Impact: ${p.impact}
  Effort: ${p.effort}
  Timeline: ${p.timeline}
  Description: ${p.description}
`).join('\n')}

Provide strategic synthesis and recommendations.`,
        json: true,
        maxTokens: 1500,
        bypassCache,
      })

      setSynthesis(result as AISynthesis)
      setHasGenerated(true)
    } catch (err) {
      console.error('Synthesis error:', err)
      const aiError = err as AIError
      setError(aiError)
      track('operator_ai_error', { module: 'roadmap', isRateLimit: aiError.isRateLimit ?? false })
    } finally {
      setLoading(false)
    }
  }

  const handleVectorChange = (vectorId: VectorType) => {
    track('operator_roadmap_vector_switched', { vector: vectorId })
    setSelectedVector(vectorId)
    setSynthesis(null)
    setError(null)
    setHasGenerated(false)
  }

  const getStatusCounts = (vector: Vector) => {
    const counts = { completed: 0, inProgress: 0, notStarted: 0 }
    vector.plays.forEach((p) => {
      if (p.status === 'Completed') counts.completed++
      else if (p.status === 'In Progress') counts.inProgress++
      else counts.notStarted++
    })
    return counts
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Growth Roadmap</h1>
            <p className="text-sm text-slate-500">Strategic plays across 4 growth vectors</p>
          </div>
        </div>
        <DemoDataBanner />
      </div>

      {/* Vector Switcher */}
      <div className="grid grid-cols-4 gap-3">
        {roadmapVectors.map((vector) => {
          const counts = getStatusCounts(vector)
          const isSelected = selectedVector === vector.id

          return (
            <motion.button
              key={vector.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVectorChange(vector.id)}
              className={cn(
                'p-4 rounded-xl text-left transition-all border',
                isSelected
                  ? 'bg-white shadow-md border-slate-300'
                  : 'bg-white/50 border-slate-200 hover:border-slate-300'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: vector.color }}
                />
                <span className="text-sm font-medium text-slate-900">{vector.label}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {counts.completed}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  {counts.inProgress}
                </span>
                <span className="flex items-center gap-1">
                  <Circle className="w-3 h-3 text-slate-300" />
                  {counts.notStarted}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Plays Column */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentVector.color }}
            />
            <h2 className="text-lg font-semibold text-slate-900">{currentVector.label}</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">{currentVector.description}</p>

          <div className="grid grid-cols-2 gap-3">
            {currentVector.plays.map((play) => (
              <PlayCard
                key={play.id}
                play={play}
                color={currentVector.color}
              />
            ))}
          </div>
        </div>

        {/* AI Synthesis Panel */}
        <div className="space-y-4">
          {isDemoMode ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <Sparkles className="w-4 h-4 text-violet-500" />
                AI Synthesis
              </div>
              <DemoModePlaceholder />
            </div>
          ) : (
            <BriefingPanel
              title="AI Synthesis"
              subtitle={currentVector.label}
              loading={loading}
              error={error}
              onRefresh={() => generateSynthesis(true)}
              onGenerate={() => generateSynthesis(false)}
              showGenerateButton={!hasGenerated && !synthesis}
            >
              {synthesis && (
                <div className="space-y-4">
                  <p className="text-violet-100 text-sm">{synthesis.summary}</p>

                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-violet-300 text-xs mb-1">Priority Play</p>
                    <p className="text-white text-sm font-medium">
                      {currentVector.plays.find((p) => p.id === synthesis.priorityPlay)?.title || synthesis.priorityPlay}
                    </p>
                    <p className="text-violet-200 text-xs mt-1">{synthesis.reasoning}</p>
                  </div>

                  {synthesis.risks.length > 0 && (
                    <div>
                      <p className="text-violet-300 text-xs mb-2">Key Risks</p>
                      <ul className="space-y-1">
                        {synthesis.risks.map((risk, i) => (
                          <li key={i} className="text-xs text-amber-300 flex items-start gap-1">
                            <span className="text-amber-400">•</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {synthesis.dependencies.length > 0 && (
                    <div>
                      <p className="text-violet-300 text-xs mb-2">Dependencies</p>
                      <ul className="space-y-1">
                        {synthesis.dependencies.map((dep, i) => (
                          <li key={i} className="text-xs text-violet-200 flex items-start gap-1">
                            <span className="text-violet-400">•</span>
                            {dep}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </BriefingPanel>
          )}
        </div>
      </div>
    </div>
  )
}
