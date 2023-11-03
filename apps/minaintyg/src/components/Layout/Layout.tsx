import { Outlet } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'
import { LayoutFooter } from './LayoutFooter/LayoutFooter'
import { LayoutHeader } from './LayoutHeader/LayoutHeader'
import { ScrollTopButton } from './ScrollTopButton'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="relative flex-1">
        <div className="ids-content m-auto max-w-screen-xl overflow-hidden px-2.5 py-5">
          <Breadcrumbs />
          <div className="max-w-screen-lg">
            <Outlet />
          </div>
        </div>
        <ScrollTopButton />
      </main>
      <LayoutFooter />
    </div>
  )
}
