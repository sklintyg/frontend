import { ReactNode } from 'react'
import { useGetUserQuery } from '../../store/hooks'

export function ProtectedRoute({ children }: { children: ReactNode }): JSX.Element | null {
  const { isError, isLoading } = useGetUserQuery()

  if (isLoading) {
    return null
  }

  if (isError) {
    window.open(import.meta.env.VITE_LOGIN_URL, '_self')
    return null
  }

  return <>{children}</>
}
