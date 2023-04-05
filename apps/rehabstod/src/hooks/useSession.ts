import { useEffect } from 'react'
import { useGetSessionPingQuery, useGetUserQuery } from '../store/api'
import { useLogout } from './useLogout'

export function useSession() {
  const { logout } = useLogout()
  const { data: user } = useGetUserQuery()
  const { data: session } = useGetSessionPingQuery(undefined, {
    pollingInterval: 30e3,
  })

  useEffect(() => {
    if (user && session && !session.authenticated) {
      logout()
    }
  }, [user, session, logout])
}
