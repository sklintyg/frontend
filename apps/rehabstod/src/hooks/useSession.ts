import { useEffect } from 'react'
import { useGetSessionPingQuery, useGetUserQuery, useGiveConsentMutation } from '../store/api'
import { useLogout } from './useLogout'

export function useSession() {
  const { logout } = useLogout()
  const [giveConsent, { isUninitialized }] = useGiveConsentMutation()
  const { data: session, isLoading: isLoadingSession } = useGetSessionPingQuery(undefined, {
    pollingInterval: 30e3,
  })
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery()

  useEffect(() => {
    if (user && user.pdlConsentGiven === false && isUninitialized) {
      giveConsent({ pdlConsentGiven: true })
    }
    if (user && session && !session.authenticated) {
      logout()
    }
  }, [user, session, logout, giveConsent, isUninitialized])

  return { user, session, isLoading: isLoadingSession || isLoadingUser }
}
