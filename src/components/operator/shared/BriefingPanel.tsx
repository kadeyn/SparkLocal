import { ReactNode } from 'react'
import { Sparkles, RefreshCw, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AIError } from '@/lib/ai'

interface BriefingPanelProps {
  title: string
  subtitle?: string
  children: ReactNode
  loading?: boolean
  error?: AIError | null
  onRefresh?: () => void
  onGenerate?: () => void
  showGenerateButton?: boolean
  className?: string
}

export default function BriefingPanel({
  title,
  subtitle,
  children,
  loading = false,
  error = null,
  onRefresh,
  onGenerate,
  showGenerateButton = false,
  className,
}: BriefingPanelProps) {
  const isRateLimit = error?.isRateLimit

  return (
    <div
      className={cn('rounded-2xl p-6 relative overflow-hidden', className)}
      style={{
        background: 'linear-gradient(135deg, #1a1640 0%, #2a1f5c 50%, #4d2a6b 100%)',
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
            <div>
              <span className="text-white text-sm font-medium">{title}</span>
              {subtitle && (
                <p className="text-violet-300 text-xs">{subtitle}</p>
              )}
            </div>
          </div>
          {onRefresh && !showGenerateButton && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-violet-200 text-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
              Refresh
            </button>
          )}
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
                {isRateLimit
                  ? 'Free model rate-limited. Retry in 30s, or set VITE_OPENROUTER_MODEL to a paid model in .env'
                  : 'Check your API key and network connection.'}
              </div>
              <button
                onClick={onRefresh}
                className="text-xs font-bold text-red-300 hover:text-red-200 flex items-center gap-1"
              >
                <RefreshCw size={11} /> Retry
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-white/20 rounded w-3/4" />
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-5/6" />
          </div>
        ) : showGenerateButton && onGenerate ? (
          <div className="text-center py-4">
            <p className="text-violet-200 text-sm mb-3">Click to generate AI synthesis</p>
            <button
              onClick={onGenerate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/30 hover:bg-violet-500/50 text-white text-sm font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate AI Synthesis
            </button>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
