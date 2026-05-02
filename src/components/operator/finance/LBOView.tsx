import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { callAI } from '@/lib/ai'
import { track } from '@/lib/track'
import { useDebouncedValue } from '@/lib/useDebouncedValue'
import {
  acquisitionTargets,
  calculateLBOReturns,
} from '@/data/operatorAcquisitionTargets'
import { DemoDataBanner, BriefingPanel, DemoModePlaceholder } from '../shared'

interface LBOAdvisory {
  verdict: 'pursue' | 'pass' | 'negotiate'
  confidence: number
  summary: string
  dealStrengths: string[]
  dealRisks: string[]
  negotiationPoints: string[]
  recommendation: string
}

const VERDICT_COLORS = {
  pursue: '#22C8A9',
  pass: '#F97362',
  negotiate: '#FFA94D',
}

export default function LBOView() {
  const [selectedTargetId, setSelectedTargetId] = useState(acquisitionTargets[0].id)
  const [debtPct, setDebtPct] = useState(40)
  const [advisory, setAdvisory] = useState<LBOAdvisory | null>(null)
  const [loading, setLoading] = useState(false)

  const isDemoMode = import.meta.env.VITE_AI_DEMO_MODE === 'true'
  const selectedTarget = acquisitionTargets.find((t) => t.id === selectedTargetId)!

  // Debounce debt percentage for AI calls
  const debouncedDebtPct = useDebouncedValue(debtPct, 800)

  const lboReturns = calculateLBOReturns(selectedTarget, {
    targetId: selectedTargetId,
    debtPercentage: debtPct,
    interestRate: 8,
    holdPeriod: 5,
    exitMultiple: 8,
  })

  const generateAdvisory = async () => {
    if (isDemoMode) return

    setLoading(true)
    track('operator_ai_synthesis_regenerated', { module: 'lbo' })

    try {
      const result = await callAI({
        system: `You are an M&A advisor for SparkLocal evaluating acquisition opportunities. Provide detailed deal advisory based on the target profile and LBO returns.

Respond in JSON format:
{
  "verdict": "pursue" | "pass" | "negotiate",
  "confidence": number (0-100),
  "summary": "2-3 sentence deal thesis",
  "dealStrengths": ["strength 1", "strength 2"],
  "dealRisks": ["risk 1", "risk 2"],
  "negotiationPoints": ["point 1", "point 2"],
  "recommendation": "Specific next step recommendation"
}`,
        prompt: `Evaluate this acquisition target:

Target: ${selectedTarget.name}
Type: ${selectedTarget.type}
Location: ${selectedTarget.location}
Description: ${selectedTarget.description}

Metrics:
- Annual GMV: $${selectedTarget.metrics.gmv}K
- Annual Revenue: $${selectedTarget.metrics.revenue}K
- EBITDA: $${selectedTarget.metrics.ebitda}K
- Active Users: ${selectedTarget.metrics.users}
- YoY Growth: ${selectedTarget.metrics.growth}%

Deal Terms:
- Asking Price: $${selectedTarget.askingPrice}K
- Debt: ${debtPct}% ($${lboReturns.debtAmount.toFixed(0)}K)
- Equity: ${100 - debtPct}% ($${lboReturns.equityInvested.toFixed(0)}K)

Synergies:
- Revenue Synergies: $${selectedTarget.synergies.revenueSynergies}K/year
- Cost Synergies: $${selectedTarget.synergies.costSynergies}K/year
- Timeline: ${selectedTarget.synergies.timeline}

LBO Returns (5-year, 8x exit):
- Projected EBITDA: $${lboReturns.projectedEbitda.toFixed(0)}K
- Exit Value: $${lboReturns.exitValue.toFixed(0)}K
- Equity Value: $${lboReturns.equityValue.toFixed(0)}K
- MOIC: ${lboReturns.moic}x
- IRR: ${lboReturns.irr}%

Strengths: ${selectedTarget.strengths.join(', ')}
Risks: ${selectedTarget.risks.join(', ')}

Provide M&A advisory.`,
        json: true,
        maxTokens: 2000,
      })

      setAdvisory(result as LBOAdvisory)
    } catch (error) {
      console.error('LBO AI error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Regenerate when target or debounced debt changes
  useEffect(() => {
    if (!isDemoMode) {
      generateAdvisory()
    }
  }, [selectedTargetId, debouncedDebtPct])

  const handleTargetChange = (targetId: string) => {
    track('operator_lbo_target_selected', { targetId })
    setSelectedTargetId(targetId)
    setAdvisory(null)
  }

  const handleDebtChange = (newDebtPct: number) => {
    setDebtPct(newDebtPct)
    // Track only on debounced value via useEffect
  }

  // Track debounced debt changes
  useEffect(() => {
    if (debouncedDebtPct !== 40) { // Skip initial value
      track('operator_lbo_debt_changed', { debtPct: debouncedDebtPct })
    }
  }, [debouncedDebtPct])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">LBO / M&A Analysis</h1>
            <p className="text-sm text-slate-500">Evaluate acquisition targets and deal structures</p>
          </div>
        </div>
        <DemoDataBanner />
      </div>

      {/* Target Selector */}
      <div className="grid grid-cols-3 gap-4">
        {acquisitionTargets.map((target) => (
          <motion.button
            key={target.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTargetChange(target.id)}
            className={cn(
              'p-4 rounded-xl text-left transition-all border',
              selectedTargetId === target.id
                ? 'bg-white shadow-md border-violet-300 ring-1 ring-violet-200'
                : 'bg-white/50 border-slate-200 hover:border-slate-300'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-900">{target.name}</span>
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  target.type === 'competitor' && 'bg-violet-100 text-violet-700',
                  target.type === 'infrastructure' && 'bg-blue-100 text-blue-700',
                  target.type === 'adjacent' && 'bg-amber-100 text-amber-700'
                )}
              >
                {target.type}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">{target.location}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Asking: ${(target.askingPrice / 1000).toFixed(1)}M</span>
              <span className="text-emerald-600 font-medium">+{target.metrics.growth}% YoY</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Deal Structure */}
        <div className="col-span-2 space-y-6">
          {/* Target Profile */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">{selectedTarget.name}</h3>
            <p className="text-sm text-slate-600 mb-4">{selectedTarget.description}</p>

            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Annual GMV</p>
                <p className="text-lg font-semibold text-slate-900">${selectedTarget.metrics.gmv}K</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Revenue</p>
                <p className="text-lg font-semibold text-slate-900">${selectedTarget.metrics.revenue}K</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">EBITDA</p>
                <p className={cn(
                  'text-lg font-semibold',
                  selectedTarget.metrics.ebitda < 0 ? 'text-red-600' : 'text-slate-900'
                )}>
                  ${selectedTarget.metrics.ebitda}K
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Users</p>
                <p className="text-lg font-semibold text-slate-900">{selectedTarget.metrics.users.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Growth</p>
                <p className="text-lg font-semibold text-emerald-600">+{selectedTarget.metrics.growth}%</p>
              </div>
            </div>

            {/* Debt Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Debt / Equity Mix</span>
                <span className="text-sm text-slate-500">{debtPct}% Debt / {100 - debtPct}% Equity</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={debtPct}
                onChange={(e) => handleDebtChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>All Equity</span>
                <span>80% Debt</span>
              </div>
            </div>

            {/* LBO Returns */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3">LBO Returns (5-year, 8x exit)</h4>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Equity Invested</p>
                  <p className="text-lg font-semibold text-slate-900">${lboReturns.equityInvested.toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Equity at Exit</p>
                  <p className={cn(
                    'text-lg font-semibold',
                    lboReturns.equityValue > lboReturns.equityInvested ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    ${lboReturns.equityValue.toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">MOIC</p>
                  <p className={cn(
                    'text-lg font-semibold',
                    lboReturns.moic >= 2 ? 'text-emerald-600' : lboReturns.moic >= 1 ? 'text-amber-600' : 'text-red-600'
                  )}>
                    {lboReturns.moic}x
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">IRR</p>
                  <p className={cn(
                    'text-lg font-semibold',
                    lboReturns.irr >= 20 ? 'text-emerald-600' : lboReturns.irr >= 10 ? 'text-amber-600' : 'text-red-600'
                  )}>
                    {lboReturns.irr}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Risks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-medium text-emerald-700 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Strengths
              </h4>
              <ul className="space-y-2">
                {selectedTarget.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-emerald-500">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Risks
              </h4>
              <ul className="space-y-2">
                {selectedTarget.risks.map((r, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-red-500">!</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* AI Advisory Panel */}
        <div className="space-y-4">
          {isDemoMode ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <Sparkles className="w-4 h-4 text-violet-500" />
                Deal Advisory AI
              </div>
              <DemoModePlaceholder />
            </div>
          ) : (
            <BriefingPanel
              title="Deal Advisory AI"
              subtitle={selectedTarget.name}
              loading={loading}
              onRefresh={generateAdvisory}
            >
              {advisory && (
                <div className="space-y-4">
                  {/* Verdict Badge */}
                  <div className="flex items-center gap-3">
                    <div
                      className="px-3 py-1 rounded-full text-sm font-semibold text-white uppercase"
                      style={{ backgroundColor: VERDICT_COLORS[advisory.verdict] }}
                    >
                      {advisory.verdict}
                    </div>
                    <span className="text-violet-200 text-sm">{advisory.confidence}% confidence</span>
                  </div>

                  <p className="text-violet-100 text-sm">{advisory.summary}</p>

                  {advisory.dealStrengths.length > 0 && (
                    <div>
                      <p className="text-emerald-300 text-xs mb-2">Deal Strengths</p>
                      <ul className="space-y-1">
                        {advisory.dealStrengths.map((s, i) => (
                          <li key={i} className="text-xs text-emerald-200 flex items-start gap-1">
                            <span className="text-emerald-400">+</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {advisory.dealRisks.length > 0 && (
                    <div>
                      <p className="text-red-300 text-xs mb-2">Deal Risks</p>
                      <ul className="space-y-1">
                        {advisory.dealRisks.map((r, i) => (
                          <li key={i} className="text-xs text-red-200 flex items-start gap-1">
                            <span className="text-red-400">!</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {advisory.negotiationPoints.length > 0 && (
                    <div>
                      <p className="text-amber-300 text-xs mb-2">Negotiation Points</p>
                      <ul className="space-y-1">
                        {advisory.negotiationPoints.map((p, i) => (
                          <li key={i} className="text-xs text-amber-200 flex items-start gap-1">
                            <span className="text-amber-400">→</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-violet-300 text-xs mb-1">Recommendation</p>
                    <p className="text-white text-sm">{advisory.recommendation}</p>
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
