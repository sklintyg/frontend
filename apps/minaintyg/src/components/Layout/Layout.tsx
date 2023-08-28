import { Outlet } from 'react-router-dom'
import { LayoutFooter } from './LayoutFooter'
import { LayoutHeader } from './LayoutHeader'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="flex-1">
        <div className="ids-content m-auto max-w-7xl px-2.5 py-10">
          <Outlet />
        </div>
      </main>
      <LayoutFooter />
    </div>
  )
}
