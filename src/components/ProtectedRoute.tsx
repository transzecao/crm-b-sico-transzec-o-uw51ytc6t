import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">
        Carregando acessos...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Master role bypasses all route restrictions
    if (user.role === 'master') {
      return <Outlet />
    }

    if (user.role === 'sup_financeiro') return <Navigate to="/financeiro" replace />
    if (user.role === 'sup_comercial') return <Navigate to="/pipeline/1" replace />
    if (user.role === 'sup_coleta') return <Navigate to="/roteirizacao" replace />
    if (user.role === 'func_comercial') return <Navigate to="/pipeline/1" replace />
    if (user.role === 'func_marketing') return <Navigate to="/pipeline/2" replace />
    if (user.role === 'func_coleta') return <Navigate to="/roteirizacao" replace />
    if (user.role === 'cliente') return <Navigate to="/portal" replace />
    return <Navigate to="/app/dashboard" replace />
  }

  return <Outlet />
}
