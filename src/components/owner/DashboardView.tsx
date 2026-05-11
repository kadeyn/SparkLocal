import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  Briefcase,
  Clock,
  DollarSign,
  RefreshCw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  AlertTriangle,
} from 'lucide-react'
import { track } from '@/lib/track'
import { callAI, type AIError } from '@/lib/ai'
import { cn } from '@/lib/utils'
import { ownerProfile } from '@/data/ownerProfile'
import { ownerKPIs } from '@/data/ownerFinancials'
import { getKidsByStage } from '@/data/ownerPipeline'
import { ownerInitiatives } from '@/data/ownerInitiatives'
import { DemoDataBanner } from '../operator/shared'

const KPI_ICONS: Record<string, React.ReactNode> = {
  gigs: <Activity className="w-4 h-4" />,
  earned: <DollarSign className="w-4 h-4" />,
  activeKids: <Users className="w-4 h-4" />,
  timeSaved: <Clock className="w-4 h-4" />,
}

interface OwnerBriefing {
  headline: string
  explanation: string
  stats: { label: string; value: string }[]
  priorities: { label: string; impact: string }[]
}

const DEMO_OWNER_BRIEFING: OwnerBriefing = {
  headline: '3 matched candidates went cold — none have heard from you in 48+ hours.',
  explanation:
    'Jaylen (94 match) and Devon (89 match) are both strong HVAC-curious teens but neither has gotten an intro message. Match scores decay if engagement is delayed past 72 hours. Meanwhile, your active apprentice Carlos is approaching the 50-hour mark — the moment to formalize a wage check-in is now, not next month.',
  stats: [
    { label: 'Matched, untouched', value: '3' },
    { label: 'Service calls turned away last week', value: '6' },
    { label: 'Net SparkLocal benefit / month', value: '$6,185' },
  ],
  priorities: [
    { label: 'Send intro message to Jaylen and Devon today', impact: 'Save 2 matches' },
    { label: 'Schedule a 90-day check-in with Carlos', impact: 'Retention +1 kid' },
    { label: 'Move "Hire 2nd tech" from Planning to Pilot', impact: '+$4.8K/mo if shipped by Q3' },
  ],
}

export default function DashboardView() {
  const [briefing, setBriefing] = useState<OwnerBriefing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AIError | null>(null)

  useEffect(() => {
    track('owner_dashboard_viewed')
    loadBriefing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadBriefing = async () => {
    setLoading(true)
    setError(null)

    const matched = getKidsByStage('matched').length
    const active = getKidsByStage('active').length
    const atRisk = ownerInitiatives.filter((i) => i.health === 'at-risk').length

    try {
      const result = await callAI({
        system: `You are an advisor to a small-business owner using SparkLocal to hire teen apprentices. Generate a short, action-oriented weekly briefing. Be specific, name the people involved, and quantify the dollar/time impact whenever possible.

Respond in JSON:
{
  "headline": "One sentence stating the single most important thing this owner should do this week.",
  "explanation": "2-3 sentences explaining the situation with names and numbers.",
  "stats": [{"label": "stat name", "value": "stat value"}],
  "priorities": [{"label": "action", "impact": "expected impact"}]
}`,
        prompt: `Owner: ${ownerProfile.name} (${ownerProfile.businessName}, ${ownerProfile.industry}, ${ownerProfile.metro})
Weeks on SparkLocal: ${ownerProfile.weeksOnPlatform}
Pipeline state:
- Matched (need outreach): ${matched}
- Active apprentices: ${active}
Initiatives at risk: ${atRisk}
Generate this week's briefing.`,
        json: true,
        mockResponse: DEMO_OWNER_BRIEFING,
        maxTokens: 900,
      })

      setBriefing(result as OwnerBriefing)
    } catch (err) {
      console.error('Owner briefing error:', err)
      const aiError = err as AIError
      setError(aiError)
      track('owner_ai_error', { module: 'briefing', isRateLimit: aiError.isRateLimit ?? false })
    } finally {
      setLoading(false)
    }
  }

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />
    return <Activity className="w-3.5 h-3.5 text-slate-400" />
  }

  const quickLinks = [
    { label: 'See pipeline', to: '/owner/pipeline', subtitle: `${getKidsByStage('matched').length} new matches` },
    {
      label: 'Open initiatives',
      to: '/owner/initiatives',
      subtitle: `${ownerInitiatives.filter((i) => i.health === 'at-risk').length} at risk`,
    },
    { label: 'Review finances', to: '/owner/finance', subtitle: 'P&L impact' },
    { label: 'Ask the Playbook', to: '/owner/playbook', subtitle: 'AI guidance' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Good morning, {ownerProfile.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-slate-500">
              Week {ownerProfile.weeksOnPlatform} on SparkLocal · {ownerProfile.businessName}
            </p>
          </div>
        </div>
        <DemoDataBanner />
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ownerKPIs.map((kpi) => (
          <motion.div
            key={kpi.id}
            whileHover={{ y: -2 }}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                {KPI_ICONS[kpi.id]}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <TrendIcon trend={kpi.trend} />
                <span>{kpi.delta}</span>
              </div>
            </div>
            <p
              className="text-2xl font-semibold text-slate-900 tracking-tight"
              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
            >
              {kpi.value}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Live briefing hero */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f3a2e 0%, #15614b 50%, #2a7d4f 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, rgba(34, 200, 169, 0.4) 0%, transparent 50%),
                               radial-gradient(circle at 80% 70%, rgba(255, 169, 77, 0.3) 0%, transparent 50%)`,
            }}
          />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <span className="text-emerald-100 text-sm font-medium">This Week’s Briefing</span>
                <p className="text-emerald-200/70 text-[11px]">AI-grounded in your real pipeline state</p>
              </div>
            </div>
            <button
              onClick={loadBriefing}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-100 text-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
              Refresh
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
              <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-red-300 mb-1">
                  {error.message || 'AI request failed'}
                </div>
                <div className="text-[11px] text-slate-300 mb-2">
                  {error.isRateLimit
                    ? 'Free model rate-limited. Retry in 30s, or set VITE_OPENROUTER_MODEL to a paid model in .env'
                    : 'Check your API key and network connection.'}
                </div>
                <button
                  onClick={loadBriefing}
                  className="text-xs font-bold text-red-300 hover:text-red-200 flex items-center gap-1"
                >
                  <RefreshCw size={11} /> Retry
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-white/20 rounded w-3/4" />
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-5/6" />
            </div>
          ) : briefing ? (
            <>
              <h2
                className="text-xl sm:text-2xl text-white mb-3 italic"
                style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
              >
                {briefing.headline}
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base mb-4">{briefing.explanation}</p>

              <div className="flex flex-wrap gap-3 mb-4">
                {briefing.stats.map((stat, i) => (
                  <div key={i} className="bg-white/10 rounded-lg px-3 py-2">
                    <p
                      className="text-white font-semibold"
                      style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-emerald-200 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-emerald-200 text-xs uppercase tracking-wider">This Week’s Priorities</p>
                {briefing.priorities.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
                  >
                    <span className="text-white text-sm">{p.label}</span>
                    <span className="text-amber-300 text-sm font-medium">{p.impact}</span>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickLinks.map((ql) => (
          <Link
            key={ql.to}
            to={ql.to}
            className="bg-white border border-slate-200 hover:border-emerald-300 rounded-xl p-4 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">{ql.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{ql.subtitle}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
