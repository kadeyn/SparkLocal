import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Activity,
  Users,
  DollarSign,
  Percent,
  UserCheck,
  Building2,
} from 'lucide-react'
import { track } from '@/lib/track'
import { callAI } from '@/lib/ai'
import {
  kpiData,
  gmvData,
  cohortRetention,
  liquidityByMetro,
  DEMO_BRIEFING_RESPONSE,
  DEMO_INSIGHT_RESPONSES,
} from '@/data/operatorMockData'
import { cn } from '@/lib/utils'

const KPI_ICONS: Record<string, React.ReactNode> = {
  wam: <Activity className="w-4 h-4" />,
  gmv: <DollarSign className="w-4 h-4" />,
  take: <DollarSign className="w-4 h-4" />,
  liquidity: <Percent className="w-4 h-4" />,
  kids: <Users className="w-4 h-4" />,
  owners: <Building2 className="w-4 h-4" />,
}

interface BriefingData {
  headline: string
  explanation: string
  stats: { label: string; value: string }[]
  actions: { label: string; impact: string }[]
}

export default function DashboardView() {
  const [briefing, setBriefing] = useState<BriefingData | null>(null)
  const [briefingLoading, setBriefingLoading] = useState(true)
  const [insights, setInsights] = useState<Record<string, string>>({})
  const [insightLoading, setInsightLoading] = useState<string | null>(null)

  // Load initial briefing
  useEffect(() => {
    loadBriefing()
  }, [])

  const loadBriefing = async () => {
    setBriefingLoading(true)
    track('operator_briefing_requested')

    try {
      const result = await callAI({
        system: `You are a growth analyst for SparkLocal, a youth entrepreneurship marketplace. Analyze the current metrics and provide a daily briefing.

Current metrics:
- Weekly Active Matches: 847 (+12.4%)
- GMV this week: $28.2K (+9.3%)
- Average Liquidity: 62% (+4.1%)
- Active Kids: 441 (+8.7%)
- Active Owners: 76 (+5.2%)

Respond in JSON format:
{
  "headline": "One sentence summarizing the biggest opportunity or risk",
  "explanation": "2-3 sentences explaining the situation with data",
  "stats": [{"label": "stat name", "value": "stat value"}],
  "actions": [{"label": "action description", "impact": "expected impact"}]
}`,
        prompt: 'Generate today\'s briefing based on current marketplace health.',
        json: true,
        mockResponse: DEMO_BRIEFING_RESPONSE,
      })

      setBriefing(result as BriefingData)
    } catch (error) {
      console.error('Briefing error:', error)
      setBriefing(DEMO_BRIEFING_RESPONSE)
    } finally {
      setBriefingLoading(false)
    }
  }

  const loadInsight = async (kpiId: string) => {
    if (insights[kpiId] || insightLoading) return

    setInsightLoading(kpiId)
    track('operator_insight_requested', { kpi: kpiId })

    try {
      const result = await callAI({
        system: `You are a growth analyst for SparkLocal. Provide a brief insight about a specific metric. Keep it to 2-3 sentences with actionable context.`,
        prompt: `Provide insight for the "${kpiId}" metric.`,
        mockResponse: DEMO_INSIGHT_RESPONSES[kpiId] || 'No insight available for this metric.',
      })

      setInsights((prev) => ({ ...prev, [kpiId]: result as string }))
    } catch (error) {
      console.error('Insight error:', error)
      setInsights((prev) => ({
        ...prev,
        [kpiId]: DEMO_INSIGHT_RESPONSES[kpiId] || 'Unable to load insight.',
      }))
    } finally {
      setInsightLoading(null)
    }
  }

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />
    return <Minus className="w-3.5 h-3.5 text-slate-400" />
  }

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiData.map((kpi) => (
          <motion.button
            key={kpi.id}
            onClick={() => loadInsight(kpi.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'p-4 rounded-xl text-left transition-all',
              'bg-white border border-slate-200 hover:border-violet-300 hover:shadow-sm',
              insights[kpi.id] && 'ring-2 ring-violet-200'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                {KPI_ICONS[kpi.id]}
              </div>
              <div className="flex items-center gap-1">
                <TrendIcon trend={kpi.trend} />
                <span
                  className={cn(
                    'text-xs font-medium',
                    kpi.trend === 'up' && 'text-emerald-600',
                    kpi.trend === 'down' && 'text-red-600',
                    kpi.trend === 'stable' && 'text-slate-500'
                  )}
                >
                  {kpi.change > 0 ? '+' : ''}
                  {kpi.change}%
                </span>
              </div>
            </div>
            <p className="text-2xl font-semibold text-slate-900 tracking-tight">{kpi.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Insight Panel (shows when a KPI is clicked) */}
      {Object.keys(insights).length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-violet-50 border border-violet-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-violet-900 mb-1">AI Insight</p>
              <p className="text-sm text-violet-800">
                {insightLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Loading insight...
                  </span>
                ) : (
                  insights[Object.keys(insights)[Object.keys(insights).length - 1]]
                )}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Live Briefing Hero */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
                               radial-gradient(circle at 80% 70%, rgba(244, 114, 182, 0.3) 0%, transparent 50%)`,
            }}
          />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-300" />
              </div>
              <span className="text-violet-200 text-sm font-medium">Live Briefing</span>
            </div>
            <button
              onClick={loadBriefing}
              disabled={briefingLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-violet-200 text-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', briefingLoading && 'animate-spin')} />
              Refresh
            </button>
          </div>

          {briefingLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-white/20 rounded w-3/4" />
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-5/6" />
            </div>
          ) : briefing ? (
            <>
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
                {briefing.headline}
              </h2>
              <p className="text-violet-200 text-sm sm:text-base mb-4">{briefing.explanation}</p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 mb-4">
                {briefing.stats.map((stat, i) => (
                  <div key={i} className="bg-white/10 rounded-lg px-3 py-2">
                    <p className="text-white font-semibold">{stat.value}</p>
                    <p className="text-violet-300 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <p className="text-violet-300 text-xs uppercase tracking-wider">
                  Recommended Actions
                </p>
                {briefing.actions.map((action, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors cursor-pointer"
                  >
                    <span className="text-white text-sm">{action.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 text-sm font-medium">{action.impact}</span>
                      <ChevronRight className="w-4 h-4 text-violet-400" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* GMV Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">GMV & Take</h3>
              <p className="text-xs text-slate-500">Last 12 weeks</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span className="text-slate-600">GMV</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                <span className="text-slate-600">Take (12%)</span>
              </div>
            </div>
          </div>

          {/* Simple bar chart */}
          <div className="h-48 flex items-end gap-1.5">
            {gmvData.map((d, i) => {
              const maxGMV = Math.max(...gmvData.map((x) => x.gmv))
              const heightPercent = (d.gmv / maxGMV) * 100
              const takePercent = (d.take / d.gmv) * heightPercent

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end" style={{ height: '160px' }}>
                    <div
                      className="w-full bg-gradient-to-t from-violet-500 to-violet-400 rounded-t relative"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-500 to-pink-400 rounded-t"
                        style={{ height: `${takePercent}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">{d.week}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Liquidity by Metro */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Liquidity by Metro</h3>
              <p className="text-xs text-slate-500">Match rate percentage</p>
            </div>
          </div>

          <div className="space-y-3">
            {liquidityByMetro.map((metro, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700">{metro.metro}</span>
                    <TrendIcon trend={metro.trend} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>
                      <UserCheck className="w-3 h-3 inline mr-1" />
                      {metro.kids}
                    </span>
                    <span>
                      <Building2 className="w-3 h-3 inline mr-1" />
                      {metro.owners}
                    </span>
                    <span
                      className={cn(
                        'font-medium',
                        metro.liquidity >= 65 && 'text-emerald-600',
                        metro.liquidity >= 50 && metro.liquidity < 65 && 'text-amber-600',
                        metro.liquidity < 50 && 'text-red-600'
                      )}
                    >
                      {metro.liquidity}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      metro.liquidity >= 65 && 'bg-emerald-500',
                      metro.liquidity >= 50 && metro.liquidity < 65 && 'bg-amber-500',
                      metro.liquidity < 50 && 'bg-red-500'
                    )}
                    style={{ width: `${metro.liquidity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cohort Retention */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900">Cohort Retention</h3>
            <p className="text-xs text-slate-500">Retention % by user type over time</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              <span className="text-slate-600">Kids</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              <span className="text-slate-600">Owners</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-600">Parents</span>
            </div>
          </div>
        </div>

        {/* Simple line chart approximation with SVG */}
        <div className="h-48 relative">
          <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={180 - (y / 100) * 160}
                x2="500"
                y2={180 - (y / 100) * 160}
                stroke="#e2e8f0"
                strokeDasharray="4"
              />
            ))}

            {/* Kids line */}
            <polyline
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={cohortRetention
                .map((d, i) => `${(i / (cohortRetention.length - 1)) * 480 + 10},${180 - (d.kids / 100) * 160}`)
                .join(' ')}
            />

            {/* Owners line */}
            <polyline
              fill="none"
              stroke="#ec4899"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={cohortRetention
                .map((d, i) => `${(i / (cohortRetention.length - 1)) * 480 + 10},${180 - (d.owners / 100) * 160}`)
                .join(' ')}
            />

            {/* Parents line */}
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={cohortRetention
                .map((d, i) => `${(i / (cohortRetention.length - 1)) * 480 + 10},${180 - (d.parents / 100) * 160}`)
                .join(' ')}
            />

            {/* Data points */}
            {cohortRetention.map((d, i) => {
              const x = (i / (cohortRetention.length - 1)) * 480 + 10
              return (
                <g key={i}>
                  <circle cx={x} cy={180 - (d.kids / 100) * 160} r="4" fill="#8b5cf6" />
                  <circle cx={x} cy={180 - (d.owners / 100) * 160} r="4" fill="#ec4899" />
                  <circle cx={x} cy={180 - (d.parents / 100) * 160} r="4" fill="#f59e0b" />
                </g>
              )
            })}
          </svg>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-slate-400">
            {cohortRetention.map((d) => (
              <span key={d.week}>W{d.week}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
