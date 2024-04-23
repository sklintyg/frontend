import { useEffect, useState } from 'react'
import { api, useGetSessionPingQuery, useGetUserQuery, useGiveConsentMutation } from '../store/api'
import { useLogout } from './useLogout'

export function useSession() {
  useGetUserQuery()
  const { logout } = useLogout()
  const [giveConsent, { isUninitialized }] = useGiveConsentMutation()
  const [isPollingActive, setIsPollingActive] = useState(true)
  const { data: user, error: userError, isLoading: isLoadingUser, isError: isUserError } = api.endpoints.getUser.useQueryState()
  const {
    data: session,
    error: sessionError,
    isLoading: isLoadingSession,
    isError: isSessionError,
  } = useGetSessionPingQuery(undefined, {
    pollingInterval: 30e3,
    skip: !isPollingActive,
  })

  const isError = isSessionError || isUserError
  const isLoading = !isError && (isLoadingSession || isLoadingUser)

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

  return { user, session, error: userError || sessionError, isLoading, isError, isPollingActive }
}
