import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Brain, Megaphone, LogOut, Zap, Radio } from 'lucide-react'
import { track } from '@/lib/track'
import { cn } from '@/lib/utils'
import DashboardView from './DashboardView'
import KnowledgeView from './KnowledgeView'
import PitchView from './PitchView'

type TabType = 'dashboard' | 'knowledge' | 'pitch'

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'knowledge', label: 'Strategy AI', icon: <Brain className="w-4 h-4" /> },
  { id: 'pitch', label: 'Pitch Generator', icon: <Megaphone className="w-4 h-4" /> },
]

export default function OperatorLayout() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const currentTab = (searchParams.get('tab') as TabType) || 'dashboard'

  // Load operator fonts
  useEffect(() => {
    // Inter Tight
    const interTight = document.createElement('link')
    interTight.rel = 'stylesheet'
    interTight.href =
      'https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap'
    document.head.appendChild(interTight)

    // Fraunces
    const fraunces = document.createElement('link')
    fraunces.rel = 'stylesheet'
    fraunces.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap'
    document.head.appendChild(fraunces)

    // JetBrains Mono
    const jetbrains = document.createElement('link')
    jetbrains.rel = 'stylesheet'
    jetbrains.href =
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap'
    document.head.appendChild(jetbrains)

    return () => {
      document.head.removeChild(interTight)
      document.head.removeChild(fraunces)
      document.head.removeChild(jetbrains)
    }
  }, [])

  // Track view on tab change
  useEffect(() => {
    if (currentTab === 'dashboard') {
      track('operator_dashboard_viewed')
    } else if (currentTab === 'knowledge') {
      track('operator_kb_viewed')
    } else if (currentTab === 'pitch') {
      track('operator_pitch_viewed')
    }
  }, [currentTab])

  const handleTabChange = (tab: TabType) => {
    setSearchParams({ tab })
  }

  const handleLogout = () => {
    track('operator_logout')
    sessionStorage.removeItem('operator_authed')
    navigate('/', { replace: true })
  }

  const modelName = import.meta.env.VITE_OPENROUTER_MODEL?.split('/')[1] || 'AI'
  const isDemoMode = import.meta.env.VITE_AI_DEMO_MODE === 'true'

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#FAFAF7',
        fontFamily: "'Inter Tight', system-ui, sans-serif",
      }}
    >
      {/* Top navigation */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: 'rgba(250, 250, 247, 0.92)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-800 tracking-tight">
                SparkLocal <span className="text-slate-400 font-normal">Operator</span>
              </span>
            </div>

            {/* Center: Tabs */}
            <nav className="hidden sm:flex items-center gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    currentTab === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Right: Status + Logout */}
            <div className="flex items-center gap-4">
              {/* Live indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-700">
                  {isDemoMode ? 'Demo' : 'Live'} · {modelName}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="sm:hidden border-t border-slate-100">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                  currentTab === tab.id
                    ? 'text-violet-600 border-b-2 border-violet-600'
                    : 'text-slate-500'
                )}
              >
                {tab.icon}
                <span className="hidden xs:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'dashboard' && <DashboardView />}
        {currentTab === 'knowledge' && <KnowledgeView />}
        {currentTab === 'pitch' && <PitchView />}
      </main>
    </div>
  )
}
