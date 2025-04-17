import { skipToken } from '@reduxjs/toolkit/query'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { getCookie } from '@frontend/utils'
import { api, useGetSessionPingQuery } from '../../store/api'
import { useAppDispatch, useAppSelector, useGetUserQuery } from '../../store/hooks'
import { SessionDialog } from '../SessionDialog/SessionDialog'
import { loginMethodEnum } from '../../schema/user.schema'
import { endSession } from '../../store/slice/session.slice'
import { useSessionWorker } from '../../hooks/useSessionWorker'

export function ProtectedRoute({ children }: { children: ReactNode }): React.JSX.Element | null {
  useSessionWorker()
  const { isError, isLoading, data: user } = useGetUserQuery()
  const dispatch = useAppDispatch()
  const hasSession = useAppSelector((state) => state.sessionSlice.hasSession)
  const { data: session } = useGetSessionPingQuery(hasSession ? undefined : skipToken, {
    pollingInterval: 30e3,
    skip: !user,
  })

  useEffect(() => {
    const onLogout = () => {
      dispatch(endSession({ reason: 'logged-out' }))

      if (user?.loginMethod !== loginMethodEnum.enum.FAKE) {
        const form = document.createElement('form')
        const input = document.createElement('input')
        form.method = 'POST'
        form.action = '/logout'
        input.type = 'hidden'
        input.name = '_csrf'
        input.value = getCookie('XSRF-TOKEN') ?? ''
        form.appendChild(input)
        document.body.appendChild(form)
        form.submit()
      }

      dispatch(api.util.resetApiState())
    }

    window.addEventListener('session-expired', onLogout)
    return () => window.removeEventListener('session-expired', onLogout)
  }, [dispatch, user])

  if (isLoading) {
    return null
  }

  if (isError) {
    window.open(import.meta.env.VITE_LOGIN_URL, '_self')
    return null
  }

  return (
    <>
      {session && session.secondsUntilExpire <= 300 && <SessionDialog />}
      {children}
    </>
  )
}
