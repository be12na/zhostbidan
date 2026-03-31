import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../modules/auth/useAuth'
import type { Role } from '../types/domain'

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: Role[] }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
