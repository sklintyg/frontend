import { LayoutFooter, LayoutHeader, LayoutHeaderNavigation } from '@frontend/components/1177'
import { ReactNode } from 'react'
import { useAppSelector, useGetUserQuery } from '../../store/hooks'
import { ErrorPageHero } from '../error/ErrorPageHero'
import { LayoutHeaderAvatar } from './LayoutHeaderAvatar'
import { ScrollTopButton } from './ScrollTopButton'

export function Layout({ children }: { children: ReactNode }) {
  const { hasSessionEnded, reason, errorId } = useAppSelector((state) => state.sessionSlice)
  const { data: user } = useGetUserQuery()
  const hasSession = useAppSelector((state) => state.sessionSlice.hasSession)

  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader mode={import.meta.env.MODE}>
        {user && (
          <>
            <LayoutHeaderAvatar />
            <LayoutHeaderNavigation mode={import.meta.env.MODE} />
          </>
        )}
      </LayoutHeader>
      <main className="relative flex-1">
        <div className="ids-content m-auto max-w-screen-xl overflow-hidden px-2.5 py-5">
          {hasSessionEnded ? <ErrorPageHero type={reason} id={errorId} /> : children}
        </div>
        <ScrollTopButton />
      </main>
      <LayoutFooter hasSession={hasSession} />
    </div>
  )
}
