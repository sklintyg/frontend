import { useEffect, useState } from 'react'
import { useLogout } from './useLogout'
import { api, useGetSessionPingQuery, useGetUserQuery, useGiveConsentMutation } from '../store/api'

export function useSession() {
  useGetUserQuery()
  const { logout } = useLogout()
  const [giveConsent, { isUninitialized }] = useGiveConsentMutation()
  const [isPollingActive, setIsPollingActive] = useState(true)
  const { data: user, isLoading: isLoadingUser } = api.endpoints.getUser.useQueryState()
  const { data: session, isLoading: isLoadingSession } = useGetSessionPingQuery(undefined, {
    pollingInterval: 30e3,
    skip: !isPollingActive,
  })

  useEffect(() => {
    if (user && user.pdlConsentGiven === false && isUninitialized) {
      giveConsent({ pdlConsentGiven: true })
    }
    if (session && user) {
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
