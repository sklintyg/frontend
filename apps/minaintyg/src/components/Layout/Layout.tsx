import { Outlet } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'
import { LayoutFooter } from './LayoutFooter'
import { LayoutHeader } from './LayoutHeader/LayoutHeader'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="flex-1">
        <div className="ids-content m-auto max-w-7xl p-5">
          <Breadcrumbs />
          <Outlet />
        </div>
      </main>
      <LayoutFooter />
    </div>
  )
}
