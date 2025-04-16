import { skipToken } from '@reduxjs/toolkit/query'
import type { ReactNode } from 'react'
import { getCookie } from '@frontend/utils'
import { api, useGetSessionPingQuery } from '../../store/api'
import { useAppDispatch, useAppSelector, useGetUserQuery } from '../../store/hooks'
import { SessionDialog } from '../SessionDialog/SessionDialog'
import { loginMethodEnum } from '../../schema/user.schema'
import { endSession } from '../../store/slice/session.slice'

export function ProtectedRoute({ children }: { children: ReactNode }): React.JSX.Element | null {
  const { isError, isLoading, data: user } = useGetUserQuery()
  const dispatch = useAppDispatch()
  const hasSession = useAppSelector((state) => state.sessionSlice.hasSession)
  const { data: session } = useGetSessionPingQuery(hasSession ? undefined : skipToken, {
    pollingInterval: 30e3,
    skip: !user,
  })

  if (isLoading) {
    return null
  }

  if (isError) {
    window.open(import.meta.env.VITE_LOGIN_URL, '_self')
    return null
  }

  if (user && session && session.secondsUntilExpire <= 30) {
    dispatch(endSession({ reason: 'logged-out' }))
    if (user.loginMethod !== loginMethodEnum.enum.FAKE) {
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

  return (
    <>
      {session && session.secondsUntilExpire <= 300 && <SessionDialog />}
      {children}
    </>
  )
}
