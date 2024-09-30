import { GlobalAlert, PriorityEnum } from 'components'
import { IDSSpinner } from 'ids-react-ts'
import { Outlet } from 'react-router-dom'
import { useSession } from '../../hooks/useSession'
import { BannerPriority } from '../../schemas'
import { useGetConfigQuery } from '../../store/api'
import { PageContainer } from '../PageContainer/PageContainer'
import { PageHero } from '../PageHero/PageHero'
import { StickyContainerProvider } from '../StickyContainer/StickyContainerProvider'
import { AboutDialog } from '../dialog/AboutDialog'
import { SettingsDialog } from '../dialog/SettingsDialog/SettingsDialog'
import { ErrorAlert } from '../error/ErrorAlert/ErrorAlert'
import { LayoutFooter } from './LayoutFooter'
import { LayoutHeader } from './LayoutHeader/LayoutHeader'

export function Layout() {
  const { user, error, isLoading, isError } = useSession()
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
      <main id="content" className="flex-1">
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
          {!isError && !isLoading && <Outlet />}
          {error && (
            <PageContainer>
              <ErrorAlert
                heading="Ett fel har inträffat"
                text="Tekniskt problem, försök igen om en stund. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand"
                errorType="error"
                error={error}
                dynamicLink
              />
            </PageContainer>
          )}
        </StickyContainerProvider>
      </main>
      <LayoutFooter />
    </div>
  )
}
