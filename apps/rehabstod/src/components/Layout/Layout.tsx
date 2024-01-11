import { GlobalAlert, PriorityEnum } from '@frontend/components'
import { IDSSpinner } from '@frontend/ids-react-ts'
import { Outlet } from 'react-router-dom'
import { LayoutFooter } from './LayoutFooter'
import { LayoutHeader } from './LayoutHeader/LayoutHeader'
import { useSession } from '../../hooks/useSession'
import { BannerPriority } from '../../schemas'
import { useGetConfigQuery } from '../../store/api'
import { AboutDialog } from '../dialog/AboutDialog'
import { SettingsDialog } from '../dialog/SettingsDialog/SettingsDialog'
import { PageHero } from '../PageHero/PageHero'
import { StickyContainerProvider } from '../StickyContainer/StickyContainerProvider'

export function Layout() {
  const { user, isLoading } = useSession()
  const { data: config } = useGetConfigQuery()

  const getAlertPriority = (priority: BannerPriority) => {
    if (priority === BannerPriority.HIGH) {
      return PriorityEnum.ERROR
    }
    return priority === BannerPriority.MEDIUM ? PriorityEnum.OBSERVE : PriorityEnum.INFO
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="flex-1">
        <StickyContainerProvider>
          {config &&
            config.banners.length > 0 &&
            config.banners.map((banner) => (
              <GlobalAlert key={banner.id} priority={getAlertPriority(banner.priority)}>
                {banner.message}
              </GlobalAlert>
            ))}
          {user && (
            <>
              <SettingsDialog />
              <AboutDialog />
            </>
          )}
          {isLoading && (
            <PageHero>
              <IDSSpinner className="inline-flex" />
            </PageHero>
          )}
          {!isLoading && <Outlet />}
        </StickyContainerProvider>
      </main>
      <LayoutFooter />
    </div>
  )
}
