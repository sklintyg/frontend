import { Outlet } from 'react-router-dom'
import { useSession } from '../../hooks/useSession'
import { SettingsDialog } from '../SettingsDialog/SettingsDialog'
import { LayoutFooter } from './LayoutFooter'
import { LayoutHeader } from './LayoutHeader'
import { useGetConfigQuery } from '../../store/api'
import { GlobalAlert } from '../GlobalAlert/GlobalAlert'

export function Layout() {
  useSession()
  const { data: config } = useGetConfigQuery()

  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="flex-1">
        {config && config.banners.length > 0 && <GlobalAlert>{config.banners[0].message}</GlobalAlert>}
        <SettingsDialog />
        <Outlet />
      </main>
      <LayoutFooter />
    </div>
  )
}
