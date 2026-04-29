import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
}

const textSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center',
          sizeClasses[size]
        )}
      >
        <Zap className={cn('text-white', iconSizes[size])} />
      </div>
      {showText && (
        <span className={cn('font-bold tracking-tight', textSizes[size])}>
          SparkLocal
        </span>
      )}
    </div>
  )
}

export function LogoIcon({ size = 'md', className }: Omit<LogoProps, 'showText'>) {
  return (
    <div
      className={cn(
        'rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center',
        sizeClasses[size],
        className
      )}
    >
      <Zap className={cn('text-white', iconSizes[size])} />
    </div>
  )
}
