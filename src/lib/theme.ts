/**
 * SparkLocal Brand Theme Configuration
 *
 * Brand Identity:
 * - Name: SparkLocal
 * - Tagline: "Opportunity Engine"
 * - Logo: Lightning bolt in a rounded square with indigo→coral gradient
 *
 * Color Palette:
 * - Primary (Indigo): #4F46E5 - Main brand color, CTAs, links
 * - Accent (Coral): #FB7185 - Highlights, badges, secondary actions
 * - Success (Mint): #10B981 - Earnings, completed states, positive feedback
 * - Background (Off-white): #FAFAF9 - Page backgrounds
 *
 * Typography:
 * - Font: Inter
 * - Headings: Tight tracking (tracking-tight), bold/extrabold
 * - Body: Regular weight, normal tracking
 *
 * Design Style:
 * - Cards: rounded-2xl with soft shadows
 * - Buttons: rounded-xl with subtle shadows
 * - Generous whitespace
 * - Robinhood/Cash App level of polish
 */

export const theme = {
  colors: {
    primary: '#4F46E5',
    primaryForeground: '#FFFFFF',
    accent: '#FB7185',
    accentForeground: '#FFFFFF',
    success: '#10B981',
    successForeground: '#FFFFFF',
    background: '#FAFAF9',
    foreground: '#1F2937',
    card: '#FFFFFF',
    cardForeground: '#1F2937',
    muted: '#F3F4F6',
    mutedForeground: '#6B7280',
    border: '#E5E7EB',
  },
  fonts: {
    sans: '"Inter", system-ui, sans-serif',
  },
  radii: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
} as const

export type Theme = typeof theme

// CSS custom properties for use in inline styles
export const cssVars = {
  '--color-primary': theme.colors.primary,
  '--color-accent': theme.colors.accent,
  '--color-success': theme.colors.success,
  '--color-background': theme.colors.background,
} as const

// Gradient utilities
export const gradients = {
  brand: 'linear-gradient(to bottom right, #4F46E5, #FB7185)',
  brandHorizontal: 'linear-gradient(to right, #4F46E5, #FB7185)',
  brandText: 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent',
} as const
