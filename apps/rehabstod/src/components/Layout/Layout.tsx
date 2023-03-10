import { IDSContainer } from '@frontend/ids-react-ts'
import { Outlet } from 'react-router-dom'
import { LayoutFooter } from './LayoutFooter'
import { LayoutHeader } from './LayoutHeader'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <LayoutHeader />
      <main className="flex-1">
        <IDSContainer gutterless>
          <Outlet />
        </IDSContainer>
      </main>
      <LayoutFooter />
    </div>
  )
}
