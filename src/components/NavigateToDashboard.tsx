import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export function NavigateToDashboard() {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  if (user.role === 'admin') return <Navigate to="/admin/logins" replace />
  if (user.role === 'supervisor') return <Navigate to="/supervisor/approvals" replace />

  return <Navigate to="/app/dashboard" replace />
}
