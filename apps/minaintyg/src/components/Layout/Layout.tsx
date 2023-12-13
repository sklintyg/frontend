import { GlobalAlert, PriorityEnum } from '@frontend/components'
import { LayoutFooter, LayoutHeader, LayoutHeaderNavigation } from '@frontend/components/1177'
import { ReactNode, useRef } from 'react'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { BannerPriority } from '../../schema/informationSchema'
import { useGetInfoQuery } from '../../store/api'
import { useAppSelector, useGetUserQuery } from '../../store/hooks'
import { ErrorPageHero } from '../error/ErrorPageHero'
import { LayoutHeaderAvatar } from './LayoutHeaderAvatar'
import { ScrollTopButton } from './ScrollTopButton'

export function Layout({ children }: { children: ReactNode }) {
  const { hasSessionEnded, reason, errorId } = useAppSelector((state) => state.sessionSlice)
  const ref = useRef<HTMLDivElement>(null)
  useDocumentTitle(ref)
  const { data: user } = useGetUserQuery()
  const hasSession = useAppSelector((state) => state.sessionSlice.hasSession)
  const { data: info } = useGetInfoQuery()
  const getAlertPriority = (priority: BannerPriority) => {
    if (priority === BannerPriority.ERROR) {
      return PriorityEnum.ERROR
    }
    return priority === BannerPriority.OBSERVE ? PriorityEnum.OBSERVE : PriorityEnum.INFO
  }
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <LayoutHeader mode={import.meta.env.MODE}>
        {user && (
          <>
            <LayoutHeaderAvatar />
            <LayoutHeaderNavigation mode={import.meta.env.MODE} activeLink="Intyg" />
          </>
        )}
      </LayoutHeader>
      <main id="content" className="relative flex-1">
        {info &&
          info.banners.length > 0 &&
          info.banners.map((banner) => (
            <GlobalAlert key={banner.type} priority={getAlertPriority(banner.type)}>
              {banner.content}
            </GlobalAlert>
          ))}
        <div ref={ref} className="ids-content m-auto max-w-screen-xl overflow-hidden px-2.5 py-5">
          {hasSessionEnded ? <ErrorPageHero type={reason} id={errorId} /> : children}
        </div>
        <ScrollTopButton />
      </main>
      <LayoutFooter hasSession={hasSession} />
    </div>
  )
}
