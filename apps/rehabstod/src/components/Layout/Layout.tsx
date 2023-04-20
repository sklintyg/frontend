import { Outlet } from 'react-router-dom'
import { useSession } from '../../hooks/useSession'
import { LayoutFooter } from './LayoutFooter'
import { LayoutHeader } from './LayoutHeader'

export function Layout() {
  useSession()
  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <LayoutFooter />
    </div>
  )
}
