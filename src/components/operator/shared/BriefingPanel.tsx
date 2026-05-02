import { ReactNode } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BriefingPanelProps {
  title: string
  subtitle?: string
  children: ReactNode
  loading?: boolean
  onRefresh?: () => void
  className?: string
}

export default function BriefingPanel({
  title,
  subtitle,
  children,
  loading = false,
  onRefresh,
  className,
}: BriefingPanelProps) {
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
          {onRefresh && (
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

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-white/20 rounded w-3/4" />
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-5/6" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
