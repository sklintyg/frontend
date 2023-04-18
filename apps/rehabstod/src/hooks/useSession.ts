import { useEffect } from 'react'
import { useGetSessionPingQuery, useGetUserQuery, useGiveConsentMutation } from '../store/api'
import { useLogout } from './useLogout'

export function useSession() {
  const { logout } = useLogout()
  const { data: user } = useGetUserQuery()
  const [giveConsent] = useGiveConsentMutation()
  const { data: session } = useGetSessionPingQuery(undefined, {
    pollingInterval: 30e3,
  })

  useEffect(() => {
    if (user && user?.pdlConsentGiven === false) {
      giveConsent({ pdlConsentGiven: true })
    }
    if (user && session && !session.authenticated) {
      logout()
    }
  }, [user, session, logout, giveConsent])
}
