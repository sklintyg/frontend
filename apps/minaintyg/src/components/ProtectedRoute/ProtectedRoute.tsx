import { ReactNode } from 'react'
import { useGetUserQuery } from '../../store/hooks'

export function ProtectedRoute({ children }: { children: ReactNode }): JSX.Element | null {
  const { isError, isLoading } = useGetUserQuery()

  if (isLoading) {
    return null
  }

  if (isError) {
    if (import.meta.env.MODE === 'development') {
      window.open('/welcome', '_self')
    } else {
      window.open('/saml2/authenticate/eleg', '_self')
    }
    return null
  }

  return <>{children}</>
}
