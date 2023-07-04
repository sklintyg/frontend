import { Outlet } from 'react-router-dom'
import { useSession } from '../../hooks/useSession'
import { AboutDialog } from '../dialog/AboutDialog'
import { SettingsDialog } from '../dialog/SettingsDialog/SettingsDialog'
import { LayoutFooter } from './LayoutFooter'
import { LayoutHeader } from './LayoutHeader'

export function Layout() {
  useSession()

  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="flex-1">
        <SettingsDialog />
        <AboutDialog />
        <Outlet />
      </main>
      <LayoutFooter />
    </div>
  )
}
