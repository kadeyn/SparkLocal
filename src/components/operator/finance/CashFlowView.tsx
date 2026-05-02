import { useState } from 'react'
import { LineChart, TrendingUp, TrendingDown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { callAI, type AIError } from '@/lib/ai'
import { track } from '@/lib/track'
import {
  cashFlowScenarios,
  calculateRunningBalance,
  STARTING_CASH,
  type Scenario,
} from '@/data/operatorCashFlow'
import { DemoDataBanner, BriefingPanel, DemoModePlaceholder } from '../shared'

interface AILevers {
  summary: string
  cashOutWeek: number | null
  levers: {
    action: string
    impact: string
    timeline: string
  }[]
  recommendation: string
}

export default function CashFlowView() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('base')
  const [aiLevers, setAiLevers] = useState<AILevers | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AIError | null>(null)
  const [hasGenerated, setHasGenerated] = useState(false)

  const isDemoMode = import.meta.env.VITE_AI_DEMO_MODE === 'true'
  const currentScenario = cashFlowScenarios.find((s) => s.id === selectedScenario)!
  const runningBalances = calculateRunningBalance(currentScenario.weeks, STARTING_CASH)

  const generateLevers = async (bypassCache = false) => {
    if (isDemoMode) return

    setLoading(true)
    setError(null)
    track('operator_ai_synthesis_regenerated', { module: 'cashflow' })

    try {
      const result = await callAI({
        system: `You are a CFO advisor for SparkLocal. Analyze the cash flow forecast and provide actionable levers to improve runway.

Respond in JSON format:
{
  "summary": "2-3 sentence analysis of cash position and trajectory",
  "cashOutWeek": number or null if runway extends beyond 13 weeks,
  "levers": [
    { "action": "specific action", "impact": "dollar impact", "timeline": "when to implement" }
  ],
  "recommendation": "Priority recommendation for the team"
}`,
        prompt: `Analyze this ${currentScenario.label} cash flow scenario:

Starting Cash: $${STARTING_CASH.toLocaleString()}
Ending Cash (Week 13): $${runningBalances[12].toLocaleString()}

Assumptions:
${currentScenario.assumptions.map((a) => `- ${a}`).join('\n')}

Weekly cash flows:
${currentScenario.weeks.map((w, i) => {
  const totalIn = w.inflows.takeRevenue + w.inflows.subscriptions + w.inflows.other
  const totalOut = w.outflows.payroll + w.outflows.marketing + w.outflows.infrastructure + w.outflows.operations + w.outflows.other
  return `${w.label}: +$${totalIn.toLocaleString()} / -$${totalOut.toLocaleString()} = Balance: $${runningBalances[i].toLocaleString()}`
}).join('\n')}

Provide cash optimization levers.`,
        json: true,
        maxTokens: 1500,
        bypassCache,
      })

      setAiLevers(result as AILevers)
      setHasGenerated(true)
    } catch (err) {
      console.error('Cash flow AI error:', err)
      const aiError = err as AIError
      setError(aiError)
      track('operator_ai_error', { module: 'cashflow', isRateLimit: aiError.isRateLimit ?? false })
    } finally {
      setLoading(false)
    }
  }

  const handleScenarioChange = (scenario: Scenario) => {
    track('operator_cashflow_scenario_switched', { scenario })
    setSelectedScenario(scenario)
    setAiLevers(null)
    setError(null)
    setHasGenerated(false)
  }

  // Calculate min/max for chart scaling
  const minBalance = Math.min(...runningBalances)
  const maxBalance = Math.max(STARTING_CASH, ...runningBalances)
  const range = maxBalance - minBalance

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <LineChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Cash Flow Forecast</h1>
            <p className="text-sm text-slate-500">13-week rolling projection with scenarios</p>
          </div>
        </div>
        <DemoDataBanner />
      </div>

      {/* Scenario Switcher */}
      <div className="flex gap-2">
        {cashFlowScenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleScenarioChange(scenario.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              selectedScenario === scenario.id
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            )}
          >
            {scenario.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Chart & Table */}
        <div className="col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500 mb-1">Starting Cash</p>
              <p className="text-2xl font-semibold text-slate-900">
                ${(STARTING_CASH / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500 mb-1">Week 13 Balance</p>
              <p className={cn(
                'text-2xl font-semibold',
                runningBalances[12] > 0 ? 'text-emerald-600' : 'text-red-600'
              )}>
                ${(runningBalances[12] / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500 mb-1">Net Burn (13w)</p>
              <p className="text-2xl font-semibold text-slate-900 flex items-center gap-1">
                ${Math.abs((STARTING_CASH - runningBalances[12]) / 1000).toFixed(0)}K
                {runningBalances[12] < STARTING_CASH ? (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                )}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Cash Balance Projection</h3>
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

                {/* Zero line if applicable */}
                {minBalance < 0 && (
                  <line
                    x1="0"
                    y1={180 - ((-minBalance / range) * 160)}
                    x2="500"
                    y2={180 - ((-minBalance / range) * 160)}
                    stroke="#f97316"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                )}

                {/* Balance line */}
                <polyline
                  fill="none"
                  stroke={selectedScenario === 'bull' ? '#22c55e' : selectedScenario === 'bear' ? '#ef4444' : '#6366f1'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={runningBalances
                    .map((balance, i) => {
                      const x = (i / (runningBalances.length - 1)) * 480 + 10
                      const y = 180 - ((balance - minBalance) / range) * 160
                      return `${x},${y}`
                    })
                    .join(' ')}
                />

                {/* Data points */}
                {runningBalances.map((balance, i) => {
                  const x = (i / (runningBalances.length - 1)) * 480 + 10
                  const y = 180 - ((balance - minBalance) / range) * 160
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={balance < 0 ? '#ef4444' : selectedScenario === 'bull' ? '#22c55e' : selectedScenario === 'bear' ? '#ef4444' : '#6366f1'}
                    />
                  )
                })}
              </svg>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-slate-400">
                {currentScenario.weeks.map((w) => (
                  <span key={w.week}>{w.label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Assumptions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-medium text-slate-900 mb-3">
              {currentScenario.label} Assumptions
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {currentScenario.assumptions.map((assumption, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-slate-400">•</span>
                  {assumption}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Levers Panel */}
        <div className="space-y-4">
          {isDemoMode ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <Sparkles className="w-4 h-4 text-violet-500" />
                AI Cash Levers
              </div>
              <DemoModePlaceholder />
            </div>
          ) : (
            <BriefingPanel
              title="AI Cash Levers"
              subtitle={currentScenario.label}
              loading={loading}
              error={error}
              onRefresh={() => generateLevers(true)}
              onGenerate={() => generateLevers(false)}
              showGenerateButton={!hasGenerated && !aiLevers}
            >
              {aiLevers && (
                <div className="space-y-4">
                  <p className="text-violet-100 text-sm">{aiLevers.summary}</p>

                  {aiLevers.cashOutWeek && (
                    <div className="bg-red-500/20 rounded-lg p-3 border border-red-400/30">
                      <p className="text-red-200 text-xs mb-1">Cash-out Warning</p>
                      <p className="text-white text-sm font-medium">
                        Week {aiLevers.cashOutWeek}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-violet-300 text-xs mb-2">Optimization Levers</p>
                    <div className="space-y-2">
                      {aiLevers.levers.map((lever, i) => (
                        <div key={i} className="bg-white/10 rounded-lg p-2">
                          <p className="text-white text-sm font-medium">{lever.action}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-emerald-300 text-xs">{lever.impact}</span>
                            <span className="text-violet-300 text-xs">{lever.timeline}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-violet-300 text-xs mb-1">Recommendation</p>
                    <p className="text-white text-sm">{aiLevers.recommendation}</p>
                  </div>
                </div>
              )}
            </BriefingPanel>
          )}
        </div>
      </div>
    </div>
  )
}
