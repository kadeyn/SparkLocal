import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Minus,
  RefreshCw,
  Rocket,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react'
import { callAI, type AIError } from '@/lib/ai'
import { track } from '@/lib/track'
import { cn } from '@/lib/utils'
import {
  OWNER_HEALTH_COLORS,
  OWNER_STAGE_COLORS,
  ownerInitiatives,
  type OwnerInitiative,
  type OwnerInitiativeStage,
} from '@/data/ownerInitiatives'
import { DemoDataBanner } from '../operator/shared'

interface OwnerVerdict {
  recommendation: 'scale' | 'troubleshoot' | 'kill'
  confidence: number
  reasoning: string
  nextActions: string[]
  risks: string[]
}

const VERDICT_COLORS: Record<OwnerVerdict['recommendation'], string> = {
  scale: '#22C8A9',
  troubleshoot: '#FFA94D',
  kill: '#F97362',
}

const VERDICT_LABELS: Record<OwnerVerdict['recommendation'], string> = {
  scale: 'Scale',
  troubleshoot: 'Troubleshoot',
  kill: 'Kill',
}

const STAGES: { id: OwnerInitiativeStage; label: string }[] = [
  { id: 'idea', label: 'Idea' },
  { id: 'planning', label: 'Planning' },
  { id: 'pilot', label: 'Pilot' },
  { id: 'scaling', label: 'Scaling' },
]

const DEMO_VERDICTS: Record<string, OwnerVerdict> = {
  'oin-1': {
    recommendation: 'scale',
    confidence: 82,
    reasoning:
      'You have 60 days of runway covering the second salary and you’re actively turning away 6 service calls/wk. The math says hire — every week of delay costs you ~$1,200 in foregone revenue. Move from Planning to Pilot now.',
    nextActions: [
      'Make the trade-school job post live this week',
      'Lock in a Carlos ride-along so the handoff is real before you onboard a peer tech',
      'Pre-screen 3 candidates before the end of May',
    ],
    risks: [
      'A second salaried hire compresses your cushion fast if call volume dips for 2+ weeks',
      'Carlos may stall on his EPA 608 if you stop investing time in him',
    ],
  },
  'oin-2': {
    recommendation: 'troubleshoot',
    confidence: 64,
    reasoning:
      'The idea is right — commercial maintenance contracts smooth revenue and the ticket size is 4x residential. But the pipeline is empty and there is no concrete outreach plan. Sequence this BEHIND the 2nd tech hire so you have capacity to actually service the contracts you land.',
    nextActions: [
      'Talk to the insurance agent first — commercial coverage may be a blocker',
      'Set a target of 3 in-person cold visits per week to Government Street',
      'Draft a 12-month maintenance agreement template you can hand-leave',
    ],
    risks: [
      'Signing a commercial contract you can’t staff to is a fast way to lose two customers',
      'Residential is profitable today; do not let commercial pull focus before you have capacity',
    ],
  },
  'oin-3': {
    recommendation: 'scale',
    confidence: 88,
    reasoning:
      'Carlos is tracking well — 22 of 40 cert hours done, 7 of 15 supervised passes. The only thing in the way is your own time. Tuesday evening sessions are a great cadence; protect them.',
    nextActions: [
      'Schedule remaining 4 EPA 608 prep sessions and put them on the family calendar',
      'Run a 1-week solo trial in June: Carlos owns 2 simple maintenance calls',
      'Order the second manifold gauge set so you can actually split jobs',
    ],
    risks: [
      'Carlos solo on diagnostics is a no — keep him supervised for those calls past August',
    ],
  },
  'oin-4': {
    recommendation: 'troubleshoot',
    confidence: 71,
    reasoning:
      'Review pipeline is structurally broken — relying on memory to ask for a review will never scale. You’re at 7 reviews and need 20; the underlying flywheel is what’s failing, not the goal.',
    nextActions: [
      'Set up the Jobber post-completion text by Friday',
      'Print and stage QR cards this weekend',
      'Personally text the 12 most recent satisfied customers',
    ],
    risks: ['The ranking goal (#3 in Mobile) is real but it’s a 6-9 month lagging metric — set expectations'],
  },
  'oin-5': {
    recommendation: 'scale',
    confidence: 76,
    reasoning:
      'A 30-day curriculum is genuinely high-leverage — halving training overhead frees a week of your time. You already have a draft and the structure is sound. Just need to ship the weekly modules.',
    nextActions: [
      'Finish Week 1 ride-along checklist this week',
      'Loom one residential install before month-end',
      'Run the curriculum with Carlos as a beta',
    ],
    risks: ['Curriculums rot — schedule a quarterly refresh on the calendar now or it dies on the vine'],
  },
  'oin-6': {
    recommendation: 'scale',
    confidence: 93,
    reasoning:
      'You’re already at 92% Jobber adoption with 4 people on it. This is essentially done — just close out the Friday cutover and cancel the Excel sub. Migration is a 1-week project, not a quarter-long one.',
    nextActions: [
      'Execute the Friday cutover',
      'Cancel the Excel mobile subscription',
      'Train Taylor on customer detail entry inside Jobber',
    ],
    risks: [
      'Carry a printed schedule for the truck the first week in case mobile data drops at a job site',
    ],
  },
}

function OwnerInitiativeCard({
  initiative,
  onClick,
}: {
  initiative: OwnerInitiative
  onClick: () => void
}) {
  const stageColor = OWNER_STAGE_COLORS[initiative.stage]
  const healthColor = OWNER_HEALTH_COLORS[initiative.health]

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-900 flex-1 pr-2">{initiative.title}</h4>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ backgroundColor: `${healthColor}15`, color: healthColor }}
        >
          {initiative.health === 'on-track' ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <AlertTriangle className="w-3 h-3" />
          )}
          {initiative.health.replace('-', ' ')}
        </div>
      </div>

      <p className="text-xs text-slate-600 line-clamp-2 mb-3">{initiative.description}</p>

      <div className="space-y-1.5 mb-3">
        {initiative.kpis.slice(0, 2).map((kpi, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-slate-500 truncate pr-2">{kpi.label}</span>
            <div className="flex items-center gap-1 shrink-0">
              <span className="font-medium text-slate-700 font-mono">{kpi.current}</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-400 font-mono">{kpi.target}</span>
              {kpi.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
              {kpi.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
              {kpi.trend === 'flat' && <Minus className="w-3 h-3 text-slate-400" />}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div
          className="px-2 py-0.5 rounded text-[10px] font-medium uppercase"
          style={{ backgroundColor: `${stageColor}15`, color: stageColor }}
        >
          {initiative.stage}
        </div>
        <span className="text-[10px] text-emerald-700 font-medium">{initiative.estImpact}</span>
      </div>

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

function InitiativeDeepDive({
  initiative,
  onClose,
}: {
  initiative: OwnerInitiative
  onClose: () => void
}) {
  const [verdict, setVerdict] = useState<OwnerVerdict | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AIError | null>(null)

  const generateVerdict = async (bypassCache = false) => {
    setLoading(true)
    setError(null)

    try {
      const result = await callAI({
        system: `You are an advisor to a small-business owner running an HVAC shop in Mobile, AL. Analyze the initiative and give a clear, blunt verdict on whether to scale, troubleshoot, or kill it. Use the dollar/time data provided. Keep the tone direct and concrete.

Respond in JSON:
{
  "recommendation": "scale" | "troubleshoot" | "kill",
  "confidence": number (0-100),
  "reasoning": "2-3 sentences",
  "nextActions": ["action 1", "action 2", "action 3"],
  "risks": ["risk 1", "risk 2"]
}`,
        prompt: `Initiative: ${initiative.title}
Stage: ${initiative.stage}
Health: ${initiative.health}
Description: ${initiative.description}

KPIs:
${initiative.kpis.map((k) => `- ${k.label}: ${k.current} / ${k.target} (${k.trend})`).join('\n')}

Blockers: ${initiative.blockers.length > 0 ? initiative.blockers.join('; ') : 'None'}
Planned next steps: ${initiative.nextSteps.join('; ')}
Est. impact: ${initiative.estImpact}

Target date: ${initiative.targetDate}
Start date: ${initiative.startDate}`,
        json: true,
        maxTokens: 1200,
        bypassCache,
        mockResponse: DEMO_VERDICTS[initiative.id] ?? DEMO_VERDICTS['oin-1'],
      })

      setVerdict(result as OwnerVerdict)
      track('owner_initiative_verdict_received', {
        initiativeId: initiative.id,
        verdict: (result as OwnerVerdict).recommendation,
      })
    } catch (err) {
      console.error('Owner verdict error:', err)
      const aiError = err as AIError
      setError(aiError)
      track('owner_ai_error', { module: 'initiative', isRateLimit: aiError.isRateLimit ?? false })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generateVerdict()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initiative.id])

  const stageColor = OWNER_STAGE_COLORS[initiative.stage]
  const healthColor = OWNER_HEALTH_COLORS[initiative.health]

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
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                  style={{ backgroundColor: `${stageColor}15`, color: stageColor }}
                >
                  {initiative.stage}
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                  style={{ backgroundColor: `${healthColor}15`, color: healthColor }}
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
              <p className="text-sm text-emerald-700 mt-1 font-medium">{initiative.estImpact}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
          <p className="text-sm text-slate-700 mb-6">{initiative.description}</p>

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
                  <p
                    className="text-lg font-semibold text-slate-900"
                    style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                  >
                    {kpi.current}
                  </p>
                  <p className="text-xs text-slate-400">Target: {kpi.target}</p>
                </div>
              ))}
            </div>
          </div>

          {initiative.blockers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Blockers
              </h3>
              <ul className="space-y-2">
                {initiative.blockers.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-lg p-3"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Planned Next Steps</h3>
            <ul className="space-y-2">
              {initiative.nextSteps.map((step, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                  <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                AI Verdict
              </h3>
              <button
                onClick={() => generateVerdict(true)}
                disabled={loading}
                className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
              >
                <RefreshCw className={cn('w-3 h-3', loading && 'animate-spin')} />
                Regenerate
              </button>
            </div>

            {error ? (
              <div
                className="rounded-xl p-3 flex items-start gap-2"
                style={{
                  background: 'rgba(249,115,98,0.08)',
                  border: '1px solid rgba(249,115,98,0.3)',
                }}
              >
                <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-red-700 mb-1">
                    {error.message || 'AI request failed'}
                  </div>
                  <div className="text-[11px] text-slate-600 mb-2">
                    {error.isRateLimit
                      ? 'Free model rate-limited. Retry in 30s, or set VITE_OPENROUTER_MODEL to a paid model in .env'
                      : 'Check your API key and network connection.'}
                  </div>
                  <button
                    onClick={() => generateVerdict(false)}
                    className="text-xs font-bold text-red-700 hover:text-red-900 flex items-center gap-1"
                  >
                    <RefreshCw size={11} /> Retry
                  </button>
                </div>
              </div>
            ) : loading ? (
              <div className="animate-pulse space-y-3 bg-slate-50 rounded-xl p-4">
                <div className="h-6 bg-slate-200 rounded w-32" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
              </div>
            ) : verdict ? (
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: VERDICT_COLORS[verdict.recommendation] }}
                  >
                    {VERDICT_LABELS[verdict.recommendation]}
                  </div>
                  <span className="text-sm text-slate-500">{verdict.confidence}% confidence</span>
                </div>

                <p className="text-sm text-slate-700 mb-4">{verdict.reasoning}</p>

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

                {verdict.risks.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">Key Risks</p>
                    <ul className="space-y-1">
                      {verdict.risks.map((r, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-amber-700">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          {r}
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

export default function InitiativesView() {
  const [selected, setSelected] = useState<OwnerInitiative | null>(null)

  const handleOpen = (initiative: OwnerInitiative) => {
    track('owner_initiative_opened', { initiativeId: initiative.id })
    setSelected(initiative)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Your Initiatives</h1>
            <p className="text-sm text-slate-500">
              {ownerInitiatives.length} operational bets · click for AI verdict
            </p>
          </div>
        </div>
        <DemoDataBanner />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const stageInits = ownerInitiatives.filter((i) => i.stage === stage.id)
          const color = OWNER_STAGE_COLORS[stage.id]

          return (
            <div key={stage.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm font-medium text-slate-900">{stage.label}</span>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  {stageInits.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 min-h-[400px] bg-slate-50/50 rounded-xl p-3">
                {stageInits.map((i) => (
                  <OwnerInitiativeCard key={i.id} initiative={i} onClick={() => handleOpen(i)} />
                ))}
                {stageInits.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-sm text-slate-400">
                    No initiatives
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {selected && <InitiativeDeepDive initiative={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
