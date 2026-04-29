import { cn } from '@/lib/utils'

interface BrandGradientProps {
  children: React.ReactNode
  className?: string
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p'
}

/**
 * Applies the SparkLocal brand gradient (indigo → coral) to text
 */
export function BrandGradient({
  children,
  className,
  as: Component = 'span',
}: BrandGradientProps) {
  return (
    <Component
      className={cn(
        'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </Component>
  )
}

interface BrandGradientBgProps {
  children: React.ReactNode
  className?: string
  direction?: 'br' | 'r' | 'b' | 'tr'
}

/**
 * Creates a background with the SparkLocal brand gradient
 */
export function BrandGradientBg({
  children,
  className,
  direction = 'br',
}: BrandGradientBgProps) {
  const directionClasses = {
    br: 'bg-gradient-to-br',
    r: 'bg-gradient-to-r',
    b: 'bg-gradient-to-b',
    tr: 'bg-gradient-to-tr',
  }

  return (
    <div
      className={cn(
        directionClasses[direction],
        'from-primary to-accent',
        className
      )}
    >
      {children}
    </div>
  )
}
