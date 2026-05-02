import { useState, useEffect } from 'react'
import { FileText, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { callAI } from '@/lib/ai'
import { track } from '@/lib/track'
import {
  plStatement,
  balanceSheet,
  keyRatios,
  type StatementView as StmtView,
} from '@/data/operatorFinancials'
import { DemoDataBanner, BriefingPanel, DemoModePlaceholder } from '../shared'

interface CrossStatementAI {
  summary: string
  concerns: { area: string; detail: string }[]
  positives: { area: string; detail: string }[]
  actionItems: string[]
}

const VIEWS: { id: StmtView; label: string }[] = [
  { id: 'pl', label: 'P&L' },
  { id: 'balance', label: 'Balance Sheet' },
  { id: 'ratios', label: 'Key Ratios' },
]

export default function StatementsView() {
  const [selectedView, setSelectedView] = useState<StmtView>('pl')
  const [aiAnalysis, setAiAnalysis] = useState<CrossStatementAI | null>(null)
  const [loading, setLoading] = useState(false)

  const isDemoMode = import.meta.env.VITE_AI_DEMO_MODE === 'true'

  const generateAnalysis = async () => {
    if (isDemoMode) return

    setLoading(true)
    track('operator_ai_synthesis_regenerated', { module: 'statements' })

    try {
      const result = await callAI({
        system: `You are a CFO analyzing financial statements for SparkLocal, an early-stage marketplace startup. Provide cross-statement analysis connecting P&L, balance sheet, and key ratios.

Respond in JSON format:
{
  "summary": "2-3 sentence synthesis of financial health",
  "concerns": [{ "area": "statement area", "detail": "specific concern" }],
  "positives": [{ "area": "statement area", "detail": "positive signal" }],
  "actionItems": ["action 1", "action 2"]
}`,
        prompt: `Analyze these financial statements:

P&L (in thousands):
${plStatement.filter(l => l.isTotal).map(l => `${l.label}: Q1=${l.q1}, Q2=${l.q2}, Q3=${l.q3}, Q4=${l.q4}`).join('\n')}

Balance Sheet (in thousands):
${balanceSheet.filter(l => l.isTotal || l.isSubtotal).map(l => `${l.label}: Current=${l.current}, Prior=${l.prior}`).join('\n')}

Key Ratios:
${keyRatios.map(r => `${r.label}: ${r.value} (Target: ${r.target}, Status: ${r.status})`).join('\n')}

Provide cross-statement analysis.`,
        json: true,
        maxTokens: 1500,
      })

      setAiAnalysis(result as CrossStatementAI)
    } catch (error) {
      console.error('Statements AI error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isDemoMode) {
      generateAnalysis()
    }
  }, [selectedView])

  const handleViewChange = (view: StmtView) => {
    track('operator_statements_view_switched', { stmt: view })
    setSelectedView(view)
  }

  const formatCurrency = (value: number, showSign = false) => {
    const formatted = `$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K`
    if (showSign && value !== 0) {
      return value < 0 ? `(${formatted})` : formatted
    }
    return formatted
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Financial Statements</h1>
            <p className="text-sm text-slate-500">P&L, Balance Sheet, and Key Ratios</p>
          </div>
        </div>
        <DemoDataBanner />
      </div>

      {/* View Switcher */}
      <div className="flex gap-2">
        {VIEWS.map((view) => (
          <button
            key={view.id}
            onClick={() => handleViewChange(view.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              selectedView === view.id
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            )}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Statement Table */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {selectedView === 'pl' && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Line Item</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Q1</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Q2</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Q3</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Q4</th>
                  </tr>
                </thead>
                <tbody>
                  {plStatement.map((item, i) => (
                    <tr
                      key={i}
                      className={cn(
                        'border-b border-slate-100',
                        item.isTotal && 'bg-slate-50 font-semibold',
                        item.isSubtotal && 'bg-slate-25'
                      )}
                    >
                      <td
                        className="py-2 px-4 text-slate-700"
                        style={{ paddingLeft: item.indent ? `${item.indent * 16 + 16}px` : '16px' }}
                      >
                        {item.label}
                      </td>
                      <td className={cn('text-right py-2 px-4', item.q1 < 0 ? 'text-red-600' : 'text-slate-700')}>
                        {item.q1 !== 0 ? formatCurrency(item.q1, item.isTotal) : '—'}
                      </td>
                      <td className={cn('text-right py-2 px-4', item.q2 < 0 ? 'text-red-600' : 'text-slate-700')}>
                        {item.q2 !== 0 ? formatCurrency(item.q2, item.isTotal) : '—'}
                      </td>
                      <td className={cn('text-right py-2 px-4', item.q3 < 0 ? 'text-red-600' : 'text-slate-700')}>
                        {item.q3 !== 0 ? formatCurrency(item.q3, item.isTotal) : '—'}
                      </td>
                      <td className={cn('text-right py-2 px-4', item.q4 < 0 ? 'text-red-600' : 'text-slate-700')}>
                        {item.q4 !== 0 ? formatCurrency(item.q4, item.isTotal) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedView === 'balance' && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Line Item</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Current</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Prior</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {balanceSheet.map((item, i) => {
                    const change = item.current - item.prior
                    return (
                      <tr
                        key={i}
                        className={cn(
                          'border-b border-slate-100',
                          item.isTotal && 'bg-slate-50 font-semibold',
                          item.isSubtotal && 'bg-slate-25'
                        )}
                      >
                        <td
                          className="py-2 px-4 text-slate-700"
                          style={{ paddingLeft: item.indent ? `${item.indent * 16 + 16}px` : '16px' }}
                        >
                          {item.label}
                        </td>
                        <td className="text-right py-2 px-4 text-slate-700">
                          {item.current !== 0 ? formatCurrency(item.current) : '—'}
                        </td>
                        <td className="text-right py-2 px-4 text-slate-700">
                          {item.prior !== 0 ? formatCurrency(item.prior) : '—'}
                        </td>
                        <td className={cn('text-right py-2 px-4', change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-600' : 'text-slate-400')}>
                          {change !== 0 ? (change > 0 ? '+' : '') + formatCurrency(change) : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}

            {selectedView === 'ratios' && (
              <div className="p-4 space-y-3">
                {keyRatios.map((ratio) => (
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
                      <p className={cn(
                        'text-lg font-semibold',
                        ratio.status === 'good' ? 'text-emerald-600' : ratio.status === 'warning' ? 'text-amber-600' : 'text-red-600'
                      )}>
                        {ratio.value}
                      </p>
                      <p className="text-xs text-slate-400">Target: {ratio.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="space-y-4">
          {isDemoMode ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <Sparkles className="w-4 h-4 text-violet-500" />
                Cross-Statement AI
              </div>
              <DemoModePlaceholder />
            </div>
          ) : (
            <BriefingPanel
              title="Cross-Statement AI"
              loading={loading}
              onRefresh={generateAnalysis}
            >
              {aiAnalysis && (
                <div className="space-y-4">
                  <p className="text-violet-100 text-sm">{aiAnalysis.summary}</p>

                  {aiAnalysis.concerns.length > 0 && (
                    <div>
                      <p className="text-red-300 text-xs mb-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Concerns
                      </p>
                      <div className="space-y-2">
                        {aiAnalysis.concerns.map((concern, i) => (
                          <div key={i} className="bg-red-500/20 rounded-lg p-2 border border-red-400/30">
                            <p className="text-red-200 text-xs">{concern.area}</p>
                            <p className="text-white text-sm">{concern.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiAnalysis.positives.length > 0 && (
                    <div>
                      <p className="text-emerald-300 text-xs mb-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Positives
                      </p>
                      <div className="space-y-2">
                        {aiAnalysis.positives.map((positive, i) => (
                          <div key={i} className="bg-emerald-500/20 rounded-lg p-2 border border-emerald-400/30">
                            <p className="text-emerald-200 text-xs">{positive.area}</p>
                            <p className="text-white text-sm">{positive.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiAnalysis.actionItems.length > 0 && (
                    <div>
                      <p className="text-violet-300 text-xs mb-2">Action Items</p>
                      <ul className="space-y-1">
                        {aiAnalysis.actionItems.map((item, i) => (
                          <li key={i} className="text-sm text-violet-100 flex items-start gap-2">
                            <span className="text-violet-400">→</span>
                            {item}
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
