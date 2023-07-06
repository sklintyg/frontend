import { Outlet } from 'react-router-dom'
import { useSession } from '../../hooks/useSession'
import { SettingsDialog } from '../SettingsDialog/SettingsDialog'
import { StickyContainerProvider } from '../StickyContainer/StickyContainerProvider'
import { LayoutFooter } from './LayoutFooter'
import { LayoutHeader } from './LayoutHeader'

export function Layout() {
  useSession()

  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="flex-1">
        <StickyContainerProvider>
          <SettingsDialog />
          <Outlet />
        </StickyContainerProvider>
      </main>
      <LayoutFooter />
    </div>
  )
}
