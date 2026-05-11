import { Fragment, useState } from 'react'
import {
  AlertCircle,
  CheckCircle,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { callAI, type AIError } from '@/lib/ai'
import { track } from '@/lib/track'
import {
  DEMO_OWNER_FINANCE_AI,
  ownerPL,
  ownerRatios,
  ownerScenarios,
  type OwnerPLLine,
  type OwnerScenario,
} from '@/data/ownerFinancials'
import { BriefingPanel, DemoDataBanner } from '../operator/shared'

type StatementView = 'pl' | 'ratios' | 'scenarios'

interface CrossStatementAI {
  summary: string
  concerns: { area: string; detail: string }[]
  positives: { area: string; detail: string }[]
  actionItems: string[]
}

const VIEWS: { id: StatementView; label: string }[] = [
  { id: 'pl', label: 'P&L Impact' },
  { id: 'ratios', label: 'Key Ratios' },
  { id: 'scenarios', label: 'Scenarios' },
]

const CATEGORY_LABELS: Record<OwnerPLLine['category'], string> = {
  revenue: 'Revenue',
  savings: 'Savings',
  cost: 'Costs',
}

const CATEGORY_COLORS: Record<OwnerPLLine['category'], string> = {
  revenue: 'text-emerald-700',
  savings: 'text-blue-700',
  cost: 'text-red-700',
}

function formatUSD(n: number, opts?: { sign?: boolean }): string {
  const abs = Math.abs(n).toLocaleString('en-US')
  if (opts?.sign && n !== 0) return n < 0 ? `($${abs})` : `$${abs}`
  return `$${abs}`
}

export default function FinanceView() {
  const [view, setView] = useState<StatementView>('pl')
  const [analysis, setAnalysis] = useState<CrossStatementAI | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AIError | null>(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<OwnerScenario>(
    ownerScenarios.find((s) => s.highlight) ?? ownerScenarios[0],
  )

  const generateAnalysis = async (bypassCache = false) => {
    setLoading(true)
    setError(null)
    track('owner_ai_synthesis_regenerated', { module: 'finance' })

    try {
      const result = await callAI({
        system: `You are an advisor to a small-business owner (HVAC tech in Mobile, AL) reviewing their P&L impact from SparkLocal. Cross-reference revenue, savings, costs, key ratios, and the scenario projections. Be specific, blunt, and quantify everything.

Respond in JSON:
{
  "summary": "2-3 sentence financial-health synthesis",
  "concerns": [{ "area": "string", "detail": "string" }],
  "positives": [{ "area": "string", "detail": "string" }],
  "actionItems": ["action 1", "action 2"]
}`,
        prompt: `P&L lines (monthly $):
${ownerPL.map((l) => `- [${l.category}] ${l.label}: ${formatUSD(l.monthly)} (YTD ${formatUSD(l.ytd)})`).join('\n')}

Key ratios:
${ownerRatios.map((r) => `- ${r.label}: ${r.value} (target ${r.target}, status ${r.status})`).join('\n')}

Scenario projections (monthly net $):
${ownerScenarios.map((s) => `- ${s.label}: ${formatUSD(s.monthlyNet)} (payback ${s.payback})`).join('\n')}

Provide cross-statement analysis.`,
        json: true,
        maxTokens: 1500,
        bypassCache,
        mockResponse: DEMO_OWNER_FINANCE_AI,
      })

      setAnalysis(result as CrossStatementAI)
      setHasGenerated(true)
    } catch (err) {
      console.error('Owner finance AI error:', err)
      const aiError = err as AIError
      setError(aiError)
      track('owner_ai_error', { module: 'finance', isRateLimit: aiError.isRateLimit ?? false })
    } finally {
      setLoading(false)
    }
  }

  const totals = ownerPL.reduce(
    (acc, l) => {
      acc[l.category] += l.monthly
      return acc
    },
    { revenue: 0, savings: 0, cost: 0 },
  )
  const netMonthly = totals.revenue + totals.savings - totals.cost

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Your P&L Impact</h1>
            <p className="text-sm text-slate-500">What SparkLocal is adding and costing your shop</p>
          </div>
        </div>
        <DemoDataBanner />
      </div>

      {/* Net summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-200">
          <p className="text-xs text-emerald-700 uppercase tracking-wider">Revenue (Monthly)</p>
          <p
            className="text-2xl font-semibold text-emerald-900 mt-1"
            style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            {formatUSD(totals.revenue)}
          </p>
        </div>
        <div className="rounded-xl p-4 bg-blue-50 border border-blue-200">
          <p className="text-xs text-blue-700 uppercase tracking-wider">Time Savings (Monthly)</p>
          <p
            className="text-2xl font-semibold text-blue-900 mt-1"
            style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            {formatUSD(totals.savings)}
          </p>
        </div>
        <div className="rounded-xl p-4 bg-red-50 border border-red-200">
          <p className="text-xs text-red-700 uppercase tracking-wider">Costs (Monthly)</p>
          <p
            className="text-2xl font-semibold text-red-900 mt-1"
            style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            {formatUSD(totals.cost)}
          </p>
        </div>
        <div className="rounded-xl p-4 bg-slate-900 border border-slate-700 text-white">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Net Benefit / mo</p>
          <p
            className="text-2xl font-semibold mt-1"
            style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
          >
            {formatUSD(netMonthly)}
          </p>
        </div>
      </div>

      {/* View switcher */}
      <div className="flex gap-2 flex-wrap">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              view === v.id
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300',
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {view === 'pl' && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Line</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Monthly</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">YTD</th>
                  </tr>
                </thead>
                <tbody>
                  {(['revenue', 'savings', 'cost'] as const).map((cat) => {
                    const lines = ownerPL.filter((l) => l.category === cat)
                    return (
                      <Fragment key={cat}>
                        <tr className="bg-slate-50">
                          <td className="py-2 px-4 text-xs uppercase tracking-wider font-semibold text-slate-500">
                            {CATEGORY_LABELS[cat]}
                          </td>
                          <td colSpan={2} />
                        </tr>
                        {lines.map((line) => (
                          <tr key={line.id} className="border-b border-slate-100">
                            <td className="py-2 px-4">
                              <div className="text-slate-700">{line.label}</div>
                              {line.note && <div className="text-[11px] text-slate-400 mt-0.5">{line.note}</div>}
                            </td>
                            <td
                              className={cn('text-right py-2 px-4', CATEGORY_COLORS[line.category])}
                              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                            >
                              {formatUSD(line.monthly)}
                            </td>
                            <td
                              className="text-right py-2 px-4 text-slate-500"
                              style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                            >
                              {formatUSD(line.ytd)}
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    )
                  })}
                  <tr className="bg-slate-900 text-white font-semibold">
                    <td className="py-3 px-4">Net Monthly Benefit</td>
                    <td
                      className="text-right py-3 px-4"
                      style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                    >
                      {formatUSD(netMonthly)}
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            )}

            {view === 'ratios' && (
              <div className="p-4 space-y-3">
                {ownerRatios.map((ratio) => (
                  <div
                    key={ratio.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">{ratio.label}</span>
                        {ratio.status === 'good' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        {ratio.status === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                        {ratio.status === 'critical' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{ratio.description}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          'text-lg font-semibold',
                          ratio.status === 'good'
                            ? 'text-emerald-600'
                            : ratio.status === 'warning'
                              ? 'text-amber-600'
                              : 'text-red-600',
                        )}
                        style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                      >
                        {ratio.value}
                      </p>
                      <p className="text-xs text-slate-400">Target: {ratio.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === 'scenarios' && (
              <div className="p-4 space-y-3">
                {ownerScenarios.map((scenario) => {
                  const isSelected = scenario.id === selectedScenario.id
                  return (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        track('owner_finance_projection_viewed', { scenario: scenario.id })
                        setSelectedScenario(scenario)
                      }}
                      className={cn(
                        'w-full text-left rounded-lg p-3 transition-all',
                        isSelected
                          ? 'bg-emerald-50 border border-emerald-300 ring-2 ring-emerald-200'
                          : 'bg-slate-50 border border-transparent hover:border-slate-300',
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">{scenario.label}</span>
                          {scenario.highlight && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold uppercase">
                              Recommended
                            </span>
                          )}
                        </div>
                        <span
                          className="text-sm font-semibold text-emerald-700"
                          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
                        >
                          {formatUSD(scenario.monthlyNet)}/mo
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{scenario.description}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Payback: {scenario.payback}</p>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <BriefingPanel
            title="Cross-Statement AI"
            subtitle="Revenue + savings + costs synthesized"
            loading={loading}
            error={error}
            onRefresh={() => generateAnalysis(true)}
            onGenerate={() => generateAnalysis(false)}
            showGenerateButton={!hasGenerated && !analysis}
          >
            {analysis && (
              <div className="space-y-4">
                <p className="text-emerald-100 text-sm">{analysis.summary}</p>

                {analysis.concerns.length > 0 && (
                  <div>
                    <p className="text-red-300 text-xs mb-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Concerns
                    </p>
                    <div className="space-y-2">
                      {analysis.concerns.map((c, i) => (
                        <div key={i} className="bg-red-500/20 rounded-lg p-2 border border-red-400/30">
                          <p className="text-red-200 text-xs">{c.area}</p>
                          <p className="text-white text-sm">{c.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.positives.length > 0 && (
                  <div>
                    <p className="text-emerald-300 text-xs mb-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Positives
                    </p>
                    <div className="space-y-2">
                      {analysis.positives.map((p, i) => (
                        <div key={i} className="bg-emerald-500/20 rounded-lg p-2 border border-emerald-400/30">
                          <p className="text-emerald-200 text-xs">{p.area}</p>
                          <p className="text-white text-sm">{p.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.actionItems.length > 0 && (
                  <div>
                    <p className="text-emerald-300 text-xs mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Action Items
                    </p>
                    <ul className="space-y-1">
                      {analysis.actionItems.map((a, i) => (
                        <li key={i} className="text-sm text-emerald-100 flex items-start gap-2">
                          <span className="text-amber-300">→</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </BriefingPanel>
        </div>
      </div>
    </div>
  )
}
