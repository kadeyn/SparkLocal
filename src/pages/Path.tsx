import { useEffect } from 'react'
import { useSearchParams, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Check, Zap, TreeDeciduous, Sparkles, Rocket, Home, Bookmark, MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SkillTree, Constellation, Future } from '@/components/path'
import { kadeynProfile } from '@/data/kidProfile'
import { getProgressStats } from '@/data/skillTreeData'
import { trackPathViewed } from '@/lib/track'
import { cn } from '@/lib/utils'

type ViewType = 'tree' | 'constellation' | 'future'

const VIEW_TABS: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: 'tree', label: 'Skill Tree', icon: <TreeDeciduous className="w-4 h-4" /> },
  { id: 'constellation', label: 'Constellation', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'future', label: 'Future', icon: <Rocket className="w-4 h-4" /> },
]

// Stat pill component
function StatPill({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  color: string
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs"
      style={{ backgroundColor: `${color}15` }}
    >
      <span style={{ color }}>{icon}</span>
      <span className="font-mono font-semibold" style={{ color }}>
        {value}
      </span>
      <span className="text-muted-foreground hidden sm:inline">{label}</span>
    </div>
  )
}

// Segmented control component
function ViewToggle({
  currentView,
  onViewChange,
}: {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}) {
  return (
    <div className="flex p-1 bg-slate-100 rounded-full">
      {VIEW_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onViewChange(tab.id)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all',
            currentView === tab.id
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <span className="hidden sm:inline">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

// Bottom navigation (mobile)
function BottomNav() {
  const location = useLocation()

  const navItems = [
    { path: '/app/feed', icon: Home, label: 'Feed' },
    { path: '/app/saved', icon: Bookmark, label: 'Saved' },
    { path: '/app/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/app/path', icon: Sparkles, label: 'Path' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-16 h-full gap-0.5 transition-colors',
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Desktop sidebar
function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: '/app/feed', icon: Home, label: 'Feed' },
    { path: '/app/saved', icon: Bookmark, label: 'Saved' },
    { path: '/app/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/app/path', icon: Sparkles, label: 'Path' },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-rose-400 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg">SparkLocal</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default function Path() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentView = (searchParams.get('view') as ViewType) || 'tree'

  const stats = getProgressStats()

  const handleViewChange = (view: ViewType) => {
    setSearchParams({ view })
    trackPathViewed(view)
  }

  // Track initial view
  useEffect(() => {
    trackPathViewed(currentView)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Header */}
          <header className="mb-6">
            <div className="flex items-center justify-between mb-4">
              {/* Kid info */}
              <div className="flex items-center gap-3">
                <Avatar className="w-14 h-14 border-2 border-indigo-200">
                  <AvatarImage src={kadeynProfile.avatar} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-lg font-bold">
                    {kadeynProfile.firstName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold">{kadeynProfile.firstName}</h1>
                  <p className="text-sm text-muted-foreground">
                    {kadeynProfile.age} · Mobile, AL
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-2">
                <StatPill
                  icon={<Trophy className="w-3.5 h-3.5" />}
                  value={stats.xp}
                  label="XP"
                  color="#4F46E5"
                />
                <StatPill
                  icon={<Check className="w-3.5 h-3.5" />}
                  value={`${stats.earned}/${stats.total}`}
                  label="earned"
                  color="#22C55E"
                />
                <StatPill
                  icon={<Zap className="w-3.5 h-3.5" />}
                  value={stats.unlocked}
                  label="ready"
                  color="#FB7185"
                />
              </div>
            </div>

            {/* View toggle */}
            <ViewToggle currentView={currentView} onViewChange={handleViewChange} />
          </header>

          {/* View content */}
          <div className="min-h-[60vh]">
            <AnimatePresence mode="wait">
              {currentView === 'tree' && (
                <motion.div
                  key="tree"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="h-[65vh] md:h-[70vh]"
                >
                  <SkillTree />
                </motion.div>
              )}
              {currentView === 'constellation' && (
                <motion.div
                  key="constellation"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="h-[65vh] md:h-[70vh]"
                >
                  <Constellation />
                </motion.div>
              )}
              {currentView === 'future' && (
                <motion.div
                  key="future"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="h-[65vh] md:h-[70vh]"
                >
                  <Future />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
