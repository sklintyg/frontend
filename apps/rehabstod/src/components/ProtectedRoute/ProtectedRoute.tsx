import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useGetUserQuery } from '../../store/api'

export function ProtectedRoute({ children, requireUnit }: { children: ReactNode; requireUnit?: boolean }): React.JSX.Element | null {
  const { data: user, isLoading } = useGetUserQuery()

  if (isLoading || user?.pdlConsentGiven === false) {
    return null
  }

  if (requireUnit) {
    return user?.valdVardenhet != null ? <>{children}</> : <Navigate to="/enhet" replace />
  }

  return user != null ? <>{children}</> : <Navigate to="/" replace />
}
