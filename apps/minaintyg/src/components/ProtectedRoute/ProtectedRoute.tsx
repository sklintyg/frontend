import { skipToken } from '@reduxjs/toolkit/query'
import { ReactNode } from 'react'
import { useGetSessionPingQuery } from '../../store/api'
import { useAppSelector, useGetUserQuery } from '../../store/hooks'
import { SessionDialog } from '../SessionDialog/SessionDialog'

export function ProtectedRoute({ children }: { children: ReactNode }): React.JSX.Element | null {
  const { isError, isLoading, data: user } = useGetUserQuery()
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

  return (
    <>
      {session && session.secondsUntilExpire <= 300 && <SessionDialog />}
      {children}
    </>
  )
}
