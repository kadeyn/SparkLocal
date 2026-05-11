import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import {
  Home,
  ParentSignup,
  KidOnboarding,
  OnboardingResults,
  Feed,
  BusinessDetail,
  ParentDashboard,
  BusinessSignup,
  BusinessDashboard,
  Saved,
  Messages,
  Path,
  OwnerHome,
  MyBadges,
} from './pages'
import OperatorLogin from './components/operator/OperatorLogin'
import OperatorLayout from './components/operator/OperatorLayout'
import RequireOperator from './components/operator/RequireOperator'
import OwnerLogin from './components/owner/OwnerLogin'
import OwnerLayout from './components/owner/OwnerLayout'
import RequireOwner from './components/owner/RequireOwner'
import OwnerDashboardView from './components/owner/DashboardView'
import OwnerPipelineView from './components/owner/PipelineView'
import OwnerInitiativesView from './components/owner/InitiativesView'
import OwnerFinanceView from './components/owner/FinanceView'
import OwnerPlaybookView from './components/owner/PlaybookView'
import OwnerBadgesView from './components/owner/BadgesView'
import { track } from './lib/track'

// Global dev shortcut hook
function useDevShortcut() {
  const navigate = useNavigate()

  useEffect(() => {
    // Only enable in development mode
    if (import.meta.env.PROD) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Shift+O (Mac) or Ctrl+Shift+O (Windows)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault()
        track('operator_dev_shortcut_triggered')
        navigate('/operator/login')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])
}

export default function App() {
  useDevShortcut()

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup/parent" element={<ParentSignup />} />
      <Route path="/onboarding/kid" element={<KidOnboarding />} />
      <Route path="/onboarding/results" element={<OnboardingResults />} />
      <Route path="/app/feed" element={<Feed />} />
      <Route path="/app/saved" element={<Saved />} />
      <Route path="/app/messages" element={<Messages />} />
      <Route path="/app/path" element={<Path />} />
      <Route path="/app/badges" element={<MyBadges />} />
      <Route path="/business/:id" element={<BusinessDetail />} />
      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      <Route path="/signup/business" element={<BusinessSignup />} />
      <Route path="/business/dashboard" element={<BusinessDashboard />} />

      {/* Operator Portal Routes */}
      <Route path="/operator/login" element={<OperatorLogin />} />
      <Route
        path="/operator"
        element={
          <RequireOperator>
            <OperatorLayout />
          </RequireOperator>
        }
      />

      {/* Owner OS Routes */}
      <Route path="/owner" element={<OwnerHome />} />
      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route element={<RequireOwner />}>
        <Route element={<OwnerLayout />}>
          <Route path="/owner/dashboard" element={<OwnerDashboardView />} />
          <Route path="/owner/pipeline" element={<OwnerPipelineView />} />
          <Route path="/owner/initiatives" element={<OwnerInitiativesView />} />
          <Route path="/owner/finance" element={<OwnerFinanceView />} />
          <Route path="/owner/playbook" element={<OwnerPlaybookView />} />
          <Route path="/owner/badges" element={<OwnerBadgesView />} />
        </Route>
      </Route>
    </Routes>
  )
}
