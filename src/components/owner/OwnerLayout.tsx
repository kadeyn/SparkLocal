import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  Users,
  Rocket,
  Wallet,
  BookOpen,
  LogOut,
  Briefcase,
  Radio,
  Award,
} from 'lucide-react'
import { track } from '@/lib/track'
import { cn } from '@/lib/utils'
import { ownerProfile } from '@/data/ownerProfile'

const AUTH_KEY = 'sparklocal-owner-auth'

type OwnerTab = 'dashboard' | 'pipeline' | 'initiatives' | 'finance' | 'playbook' | 'badges'

interface TabConfig {
  id: OwnerTab
  label: string
  icon: React.ReactNode
  path: string
}

const TABS: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" />, path: '/owner/dashboard' },
  { id: 'pipeline', label: 'Pipeline', icon: <Users className="w-4 h-4" />, path: '/owner/pipeline' },
  { id: 'initiatives', label: 'Initiatives', icon: <Rocket className="w-4 h-4" />, path: '/owner/initiatives' },
  { id: 'finance', label: 'Finance', icon: <Wallet className="w-4 h-4" />, path: '/owner/finance' },
  { id: 'playbook', label: 'Playbook', icon: <BookOpen className="w-4 h-4" />, path: '/owner/playbook' },
  { id: 'badges', label: 'Badges', icon: <Award className="w-4 h-4" />, path: '/owner/badges' },
]

export default function OwnerLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const interTight = document.createElement('link')
    interTight.rel = 'stylesheet'
    interTight.href =
      'https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap'
    document.head.appendChild(interTight)

    const fraunces = document.createElement('link')
    fraunces.rel = 'stylesheet'
    fraunces.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap'
    document.head.appendChild(fraunces)

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

  const currentTab: OwnerTab =
    (TABS.find((t) => location.pathname.startsWith(t.path))?.id as OwnerTab) || 'dashboard'

  const handleTabChange = (tab: TabConfig) => {
    track('owner_tab_switched', { tab: tab.id })
    navigate(tab.path)
  }

  const handleLogout = () => {
    track('owner_logout')
    sessionStorage.removeItem(AUTH_KEY)
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-slate-800 tracking-tight">
                  SparkLocal <span className="text-slate-400 font-normal">Owner</span>
                </span>
              </div>

              <div
                className="hidden md:flex items-center gap-2 pl-3 ml-1 border-l border-slate-200"
                aria-label="Active owner"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center justify-center">
                  {ownerProfile.avatarInitials}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-medium text-slate-800">{ownerProfile.businessName}</span>
                  <span className="text-[10px] text-slate-500">{ownerProfile.metro}</span>
                </div>
              </div>
            </div>

            <motion.nav layout className="hidden sm:flex items-center gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab)}
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
            </motion.nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-700">
                  {isDemoMode ? 'Demo' : 'Live'} · {modelName}
                </span>
              </div>

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
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors whitespace-nowrap px-2',
                  currentTab === tab.id
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-slate-500'
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
