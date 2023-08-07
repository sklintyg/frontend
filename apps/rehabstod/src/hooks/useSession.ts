import { useEffect, useState } from 'react'
import { useGetSessionPingQuery, useGetUserQuery, useGiveConsentMutation } from '../store/api'
import { useLogout } from './useLogout'

export function useSession() {
  const { logout } = useLogout()
  const [giveConsent, { isUninitialized }] = useGiveConsentMutation()
  const [isPollingActive, setIsPollingActive] = useState(true)
  const { data: session, isLoading: isLoadingSession } = useGetSessionPingQuery(undefined, {
    pollingInterval: 30e3,
    skip: !isPollingActive,
  })
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery()

  useEffect(() => {
    if (user && user.pdlConsentGiven === false && isUninitialized) {
      giveConsent({ pdlConsentGiven: true })
    }
    if (session) {
      if (session.authenticated && !isPollingActive) {
        setIsPollingActive(true)
      } else if (!session.authenticated) {
        setIsPollingActive(false)
        logout()
      }
    }
  }, [user, session, logout, giveConsent, isUninitialized, isPollingActive])

  return { user, session, isLoading: isLoadingSession || isLoadingUser }
}
