import { ReactNode, useEffect } from 'react'
import { useGetUserQuery } from '../../store/api'

export function ProtectedRoute({ children }: { children: ReactNode }): JSX.Element | null {
  const { isError } = useGetUserQuery()

  useEffect(() => {
    if (isError) {
      window.open('/saml2/authenticate/eleg', '_self')
    }
  }, [isError])

  if (isError) {
    return null
  }

  return <>{children}</>
}
