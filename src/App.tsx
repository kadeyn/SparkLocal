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
} from './pages'
import OperatorLogin from './components/operator/OperatorLogin'
import OperatorLayout from './components/operator/OperatorLayout'
import RequireOperator from './components/operator/RequireOperator'
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
    </Routes>
  )
}
