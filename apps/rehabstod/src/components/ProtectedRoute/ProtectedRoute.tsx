import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useGetUserQuery } from '../../store/api'

export function ProtectedRoute({ children }: { children: ReactNode }): JSX.Element | null {
  const { data: user, isLoading } = useGetUserQuery()

  if (isLoading) {
    return null
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return user != null ? <>{children}</> : <Navigate to="/" replace />
}
