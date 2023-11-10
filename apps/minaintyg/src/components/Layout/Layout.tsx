import { ReactNode } from 'react'
import { useAppSelector } from '../../store/hooks'
import { LayoutFooter } from './LayoutFooter/LayoutFooter'
import { LayoutHeader } from './LayoutHeader/LayoutHeader'
import { ScrollTopButton } from './ScrollTopButton'
import { SessionEnded } from './SessionEnded'

export function Layout({ children }: { children: ReactNode }) {
  const hasSessionEnded = useAppSelector((state) => state.sessionSlice.hasSessionEnded)

  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="relative flex-1">
        <div className="ids-content m-auto max-w-screen-xl overflow-hidden px-2.5 py-5">
          {hasSessionEnded ? <SessionEnded /> : children}
        </div>
        <ScrollTopButton />
      </main>
      <LayoutFooter />
    </div>
  )
}
