import { IDSSpinner } from '@frontend/ids-react-ts'
import { Outlet } from 'react-router-dom'
import { useSession } from '../../hooks/useSession'
import { useGetConfigQuery } from '../../store/api'
import { GlobalAlert } from '../GlobalAlert/GlobalAlert'
import { PageHero } from '../PageHero/PageHero'
import { AboutDialog } from '../dialog/AboutDialog'
import { SettingsDialog } from '../dialog/SettingsDialog/SettingsDialog'
import { LayoutFooter } from './LayoutFooter'
import { LayoutHeader } from './LayoutHeader/LayoutHeader'

export function Layout() {
  const { user, isLoading } = useSession()
  const { data: config } = useGetConfigQuery()

  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="flex-1">
        {config &&
          config.banners.length > 0 &&
          config.banners.map((banner) => (
            <GlobalAlert key={banner.id} priority={banner.priority}>
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
      </main>
      <LayoutFooter />
    </div>
  )
}
