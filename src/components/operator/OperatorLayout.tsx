import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  Calculator,
  Rocket,
  BookOpen,
  Megaphone,
  Map,
  LineChart,
  FileText,
  LogOut,
  Zap,
  Radio,
  ShieldCheck,
  Award,
} from 'lucide-react'
import { track } from '@/lib/track'
import { cn } from '@/lib/utils'

// Existing views
import DashboardView from './DashboardView'
import KnowledgeView from './KnowledgeView'
import PitchView from './PitchView'

// New views
import { InitiativesView } from './operate'
import {
  RoadmapView,
  CashFlowView,
  StatementsView,
  LBOView,
  ComplianceView,
  BadgeIssuanceAudit,
} from './finance'

type GroupType = 'operate' | 'finance'
type OperateTab = 'dashboard' | 'initiatives' | 'knowledge' | 'pitch'
type FinanceTab = 'roadmap' | 'cashflow' | 'statements' | 'lbo' | 'compliance' | 'badges'
type TabType = OperateTab | FinanceTab

interface TabConfig {
  id: TabType
  label: string
  icon: React.ReactNode
}

const OPERATE_TABS: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
  { id: 'initiatives', label: 'Initiatives', icon: <Rocket className="w-4 h-4" /> },
  { id: 'knowledge', label: 'Strategy AI', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'pitch', label: 'Pitch', icon: <Megaphone className="w-4 h-4" /> },
]

const FINANCE_TABS: TabConfig[] = [
  { id: 'roadmap', label: 'Roadmap', icon: <Map className="w-4 h-4" /> },
  { id: 'cashflow', label: 'Cash Flow', icon: <LineChart className="w-4 h-4" /> },
  { id: 'statements', label: 'Statements', icon: <FileText className="w-4 h-4" /> },
  { id: 'lbo', label: 'LBO/M&A', icon: <Calculator className="w-4 h-4" /> },
  { id: 'compliance', label: 'Compliance', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'badges', label: 'Badges', icon: <Award className="w-4 h-4" /> },
]

const DEFAULT_TABS: Record<GroupType, TabType> = {
  operate: 'dashboard',
  finance: 'roadmap',
}

export default function OperatorLayout() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const currentGroup = (searchParams.get('group') as GroupType) || 'operate'
  const currentTab = (searchParams.get('tab') as TabType) || DEFAULT_TABS[currentGroup]

  const currentTabs = currentGroup === 'operate' ? OPERATE_TABS : FINANCE_TABS

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

  const handleGroupChange = (group: GroupType) => {
    if (group !== currentGroup) {
      track('operator_group_switched', { group })
      setSearchParams({ group, tab: DEFAULT_TABS[group] })
    }
  }

  const handleTabChange = (tab: TabType) => {
    setSearchParams({ group: currentGroup, tab })
  }

  const handleLogout = () => {
    track('operator_logout')
    sessionStorage.removeItem('operator_authed')
    navigate('/', { replace: true })
  }

  const modelName = import.meta.env.VITE_OPENROUTER_MODEL?.split('/')[1] || 'AI'
  const isDemoMode = import.meta.env.VITE_AI_DEMO_MODE === 'true'

  const renderContent = () => {
    if (currentGroup === 'operate') {
      switch (currentTab) {
        case 'dashboard':
          return <DashboardView />
        case 'initiatives':
          return <InitiativesView />
        case 'knowledge':
          return <KnowledgeView />
        case 'pitch':
          return <PitchView />
        default:
          return <DashboardView />
      }
    } else if (currentGroup === 'finance') {
      switch (currentTab) {
        case 'roadmap':
          return <RoadmapView />
        case 'cashflow':
          return <CashFlowView />
        case 'statements':
          return <StatementsView />
        case 'lbo':
          return <LBOView />
        case 'compliance':
          return <ComplianceView />
        case 'badges':
          return <BadgeIssuanceAudit />
        default:
          return <RoadmapView />
      }
    }
    return <DashboardView />
  }

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
            {/* Left: Logo + Group Switcher */}
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-slate-800 tracking-tight">
                  SparkLocal <span className="text-slate-400 font-normal">Operator</span>
                </span>
              </div>

              {/* Group Switcher */}
              <motion.div
                layout
                className="hidden sm:flex items-center rounded-lg p-0.5"
                style={{
                  border: '1px solid rgba(100, 116, 139, 0.2)',
                }}
              >
                <button
                  onClick={() => handleGroupChange('operate')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                    currentGroup === 'operate'
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                  style={{
                    backgroundColor: currentGroup === 'operate' ? '#1a1640' : 'transparent',
                  }}
                >
                  <Activity className="w-3 h-3" />
                  Operate
                </button>
                <button
                  onClick={() => handleGroupChange('finance')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                    currentGroup === 'finance'
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                  style={{
                    backgroundColor: currentGroup === 'finance' ? '#1a1640' : 'transparent',
                  }}
                >
                  <Calculator className="w-3 h-3" />
                  Finance
                </button>
              </motion.div>
            </div>

            {/* Center: Module Tabs */}
            <motion.nav layout className="hidden sm:flex items-center gap-1">
              {currentTabs.map((tab) => (
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
            </motion.nav>

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

        {/* Mobile navigation */}
        <div className="sm:hidden border-t border-slate-100">
          {/* Mobile Group Switcher */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => handleGroupChange('operate')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors',
                currentGroup === 'operate'
                  ? 'text-violet-600 bg-violet-50 border-b-2 border-violet-600'
                  : 'text-slate-500'
              )}
            >
              <Activity className="w-3 h-3" />
              Operate
            </button>
            <button
              onClick={() => handleGroupChange('finance')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors',
                currentGroup === 'finance'
                  ? 'text-violet-600 bg-violet-50 border-b-2 border-violet-600'
                  : 'text-slate-500'
              )}
            >
              <Calculator className="w-3 h-3" />
              Finance
            </button>
          </div>

          {/* Mobile Tabs */}
          <div className="flex overflow-x-auto">
            {currentTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors whitespace-nowrap px-2',
                  currentTab === tab.id
                    ? 'text-violet-600 border-b-2 border-violet-600'
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

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {renderContent()}
      </main>
    </div>
  )
}
