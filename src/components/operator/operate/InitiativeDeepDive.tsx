import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { callAI } from '@/lib/ai'
import { track } from '@/lib/track'
import type { Initiative } from '@/data/operatorInitiatives'
import { STAGE_COLORS, HEALTH_COLORS } from '@/data/operatorInitiatives'
import { DemoModePlaceholder } from '../shared'

interface InitiativeDeepDiveProps {
  initiative: Initiative
  onClose: () => void
}

interface AIVerdict {
  recommendation: 'scale' | 'troubleshoot' | 'kill'
  confidence: number
  reasoning: string
  nextActions: string[]
  risks: string[]
}

const VERDICT_COLORS = {
  scale: '#22C8A9',
  troubleshoot: '#FFA94D',
  kill: '#F97362',
}

const VERDICT_LABELS = {
  scale: 'Scale',
  troubleshoot: 'Troubleshoot',
  kill: 'Kill',
}

export default function InitiativeDeepDive({ initiative, onClose }: InitiativeDeepDiveProps) {
  const [verdict, setVerdict] = useState<AIVerdict | null>(null)
  const [loading, setLoading] = useState(false)

  const isDemoMode = import.meta.env.VITE_AI_DEMO_MODE === 'true'

  const generateVerdict = async () => {
    if (isDemoMode) return

    setLoading(true)
    track('operator_initiative_verdict_generated', { initiativeId: initiative.id })

    try {
      const result = await callAI({
        system: `You are a startup operations advisor analyzing initiative health and progress. Provide a clear verdict on whether to scale, troubleshoot, or kill the initiative based on the data provided.

Respond in JSON format:
{
  "recommendation": "scale" | "troubleshoot" | "kill",
  "confidence": number (0-100),
  "reasoning": "2-3 sentences explaining the verdict",
  "nextActions": ["action 1", "action 2", "action 3"],
  "risks": ["risk 1", "risk 2"]
}`,
        prompt: `Analyze this initiative and provide your verdict:

Title: ${initiative.title}
Stage: ${initiative.stage}
Health: ${initiative.health}
Owner: ${initiative.owner}
Description: ${initiative.description}

KPIs:
${initiative.kpis.map(k => `- ${k.label}: ${k.current} / ${k.target} (${k.trend})`).join('\n')}

Blockers: ${initiative.blockers.length > 0 ? initiative.blockers.join(', ') : 'None'}
Next Steps Planned: ${initiative.nextSteps.join(', ')}

Target Date: ${initiative.targetDate}
Start Date: ${initiative.startDate}`,
        json: true,
        maxTokens: 1500,
      })

      setVerdict(result as AIVerdict)
    } catch (error) {
      console.error('Verdict generation error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isDemoMode) {
      generateVerdict()
    }
  }, [initiative.id])

  const stageColor = STAGE_COLORS[initiative.stage]
  const healthColor = HEALTH_COLORS[initiative.health]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                  style={{
                    backgroundColor: `${stageColor}15`,
                    color: stageColor,
                  }}
                >
                  {initiative.stage}
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${healthColor}15`,
                    color: healthColor,
                  }}
                >
                  {initiative.health === 'on-track' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {initiative.health.replace('-', ' ')}
                </div>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">{initiative.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{initiative.owner}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
          {/* Description */}
          <p className="text-sm text-slate-700 mb-6">{initiative.description}</p>

          {/* KPIs */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Key Metrics</h3>
            <div className="grid grid-cols-3 gap-3">
              {initiative.kpis.map((kpi, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">{kpi.label}</span>
                    {kpi.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
                    {kpi.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                    {kpi.trend === 'flat' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{kpi.current}</p>
                  <p className="text-xs text-slate-400">Target: {kpi.target}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Blockers */}
          {initiative.blockers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Blockers
              </h3>
              <ul className="space-y-2">
                {initiative.blockers.map((blocker, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-lg p-3">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    {blocker}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Planned Next Steps</h3>
            <ul className="space-y-2">
              {initiative.nextSteps.map((step, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                  <ArrowRight className="w-4 h-4 text-violet-500 shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* AI Verdict */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                AI Verdict
              </h3>
              {!isDemoMode && (
                <button
                  onClick={generateVerdict}
                  disabled={loading}
                  className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700"
                >
                  <RefreshCw className={cn('w-3 h-3', loading && 'animate-spin')} />
                  Regenerate
                </button>
              )}
            </div>

            {isDemoMode ? (
              <DemoModePlaceholder />
            ) : loading ? (
              <div className="animate-pulse space-y-3 bg-slate-50 rounded-xl p-4">
                <div className="h-6 bg-slate-200 rounded w-32" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
              </div>
            ) : verdict ? (
              <div className="bg-slate-50 rounded-xl p-4">
                {/* Recommendation badge */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: VERDICT_COLORS[verdict.recommendation] }}
                  >
                    {VERDICT_LABELS[verdict.recommendation]}
                  </div>
                  <span className="text-sm text-slate-500">
                    {verdict.confidence}% confidence
                  </span>
                </div>

                <p className="text-sm text-slate-700 mb-4">{verdict.reasoning}</p>

                {/* Next Actions */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-slate-500 mb-2">Recommended Actions</p>
                  <ul className="space-y-1">
                    {verdict.nextActions.map((action, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                {verdict.risks.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">Key Risks</p>
                    <ul className="space-y-1">
                      {verdict.risks.map((risk, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-amber-700">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
