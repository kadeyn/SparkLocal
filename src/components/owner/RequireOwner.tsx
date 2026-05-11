import { Navigate, Outlet } from 'react-router-dom'

const AUTH_KEY = 'sparklocal-owner-auth'

export default function RequireOwner() {
  const isAuthed = sessionStorage.getItem(AUTH_KEY) === 'true'

  if (!isAuthed) {
    return <Navigate to="/owner/login" replace />
  }

  return <Outlet />
}
