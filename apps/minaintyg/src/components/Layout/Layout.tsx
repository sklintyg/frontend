import { GlobalAlert, PriorityEnum, ScrollTopButton } from '@frontend/components'
import { LayoutFooter, LayoutHeader } from '@frontend/components/1177'
import { skipToken } from '@reduxjs/toolkit/query'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { BannerPriority } from '../../schema/informationSchema'
import { useGetInfoQuery } from '../../store/api'
import { useAppSelector, useGetUserQuery } from '../../store/hooks'
import { ErrorPageHero } from '../error/ErrorPageHero'
import { LayoutHeaderAvatar } from './LayoutHeaderAvatar'

export function Layout({ children }: { children?: ReactNode }) {
  const hasSession = useAppSelector((state) => state.sessionSlice.hasSession)
  const hasSessionEnded = useAppSelector((state) => state.sessionSlice.hasSessionEnded)
  const sessionEndedErrorId = useAppSelector((state) => state.sessionSlice.errorId)
  const sessionEndedReason = useAppSelector((state) => state.sessionSlice.reason)
  const ref = useRef<HTMLDivElement>(null)
  useDocumentTitle(ref)
  const { data: user } = useGetUserQuery()
  const { data: info } = useGetInfoQuery(hasSession ? undefined : skipToken)
  const getAlertPriority = (priority: BannerPriority) => {
    if (priority === BannerPriority.ERROR) {
      return PriorityEnum.ERROR
    }
    return priority === BannerPriority.OBSERVE ? PriorityEnum.OBSERVE : PriorityEnum.INFO
  }
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <LayoutHeader mode={import.meta.env.MODE} skipToContent="#content" avatar={user && <LayoutHeaderAvatar />} />
      <main id="content" className="relative flex-1">
        {info &&
          info.banners.length > 0 &&
          info.banners.map((banner) => (
            <GlobalAlert key={banner.type} priority={getAlertPriority(banner.type)}>
              {banner.content}
            </GlobalAlert>
          ))}
        <div ref={ref} className="ids-content m-auto max-w-screen-xl overflow-hidden px-2.5 py-5">
          {hasSessionEnded ? <ErrorPageHero type={sessionEndedReason} id={sessionEndedErrorId} /> : children}
        </div>
        <ScrollTopButton />
      </main>
      <LayoutFooter hasSession={hasSession} />
    </div>
  )
}
