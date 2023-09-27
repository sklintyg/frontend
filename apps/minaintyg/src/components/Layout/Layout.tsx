import { Outlet } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'
import { LayoutFooter } from './LayoutFooter'
import { LayoutHeader } from './LayoutHeader'
import { ScrollTopButton } from './ScrollTopButton'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="relative flex-1">
        <div className="ids-content m-auto max-w-7xl overflow-hidden p-5">
          <Breadcrumbs />
          <Outlet />
        </div>
        <ScrollTopButton />
      </main>
      <LayoutFooter />
    </div>
  )
}
