import { Routes, Route } from 'react-router-dom'
import {
  Home,
  ParentSignup,
  KidOnboarding,
  Feed,
  BusinessDetail,
  ParentDashboard,
  BusinessSignup,
  BusinessDashboard,
} from './pages'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup/parent" element={<ParentSignup />} />
      <Route path="/onboarding/kid" element={<KidOnboarding />} />
      <Route path="/app/feed" element={<Feed />} />
      <Route path="/business/:id" element={<BusinessDetail />} />
      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      <Route path="/signup/business" element={<BusinessSignup />} />
      <Route path="/business/dashboard" element={<BusinessDashboard />} />
    </Routes>
  )
}
