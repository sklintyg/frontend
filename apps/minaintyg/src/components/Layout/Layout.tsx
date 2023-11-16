import { ReactNode } from 'react'
import { useAppSelector } from '../../store/hooks'
import { ErrorPageHero } from '../error/ErrorPageHero'
import { LayoutFooter } from './LayoutFooter/LayoutFooter'
import { LayoutHeader } from './LayoutHeader/LayoutHeader'
import { ScrollTopButton } from './ScrollTopButton'

export function Layout({ children }: { children: ReactNode }) {
  const { hasSessionEnded, reason, errorId } = useAppSelector((state) => state.sessionSlice)

  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="relative flex-1">
        <div className="ids-content m-auto max-w-screen-xl overflow-hidden px-2.5 py-5">
          {hasSessionEnded ? <ErrorPageHero type={reason} id={errorId} /> : children}
        </div>
        <ScrollTopButton />
      </main>
      <LayoutFooter />
    </div>
  )
}
