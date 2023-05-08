import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSession } from '../../hooks/useSession'
import { SettingsDialog } from '../SettingsDialog/SettingsDialog'
import { LayoutFooter } from './LayoutFooter'
import { LayoutHeader } from './LayoutHeader'

export function Layout() {
  const location = useLocation()
  useSession()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="flex-1">
        <SettingsDialog />
        <Outlet />
      </main>
      <LayoutFooter />
    </div>
  )
}
