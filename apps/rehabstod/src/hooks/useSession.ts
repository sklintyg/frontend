import { useEffect } from 'react'
import { useGetSessionPingQuery } from '../store/api'
import { useLogout } from './useLogout'

export function useSession() {
  const { data: session } = useGetSessionPingQuery(undefined, {
    pollingInterval: 30e3,
  })
  const { logout } = useLogout()

  useEffect(() => {
    if (session && !session.authenticated) {
      logout()
    }
  }, [session, logout])
}
