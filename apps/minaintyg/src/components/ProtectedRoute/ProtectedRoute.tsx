import { ReactNode } from 'react'
import { useGetUserQuery } from '../../store/api'

export function ProtectedRoute({ children }: { children: ReactNode }): JSX.Element | null {
  const { isError } = useGetUserQuery()

  if (isError) {
    window.open('/saml2/authenticate/eleg', '_self')
    return null
  }

  return <>{children}</>
}
