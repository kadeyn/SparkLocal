import { Navigate } from 'react-router-dom'

interface RequireOperatorProps {
  children: React.ReactNode
}

export default function RequireOperator({ children }: RequireOperatorProps) {
  const isAuthed = sessionStorage.getItem('operator_authed') === 'true'

  if (!isAuthed) {
    return <Navigate to="/operator/login" replace />
  }

  return <>{children}</>
}
