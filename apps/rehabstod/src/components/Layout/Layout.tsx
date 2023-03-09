import { IDSContainer } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { CookieDialog } from '../CookieDialog/CookieDialog'
import { LayoutFooter } from './LayoutFooter'
import { LayoutHeader } from './LayoutHeader'

export function Layout() {
  const [showCookieDialog, setShowCookieDialog] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {showCookieDialog && <CookieDialog onHide={() => setShowCookieDialog(false)} />}
      <LayoutHeader />
      <main className="flex-1">
        <IDSContainer gutterless>
          <Outlet />
        </IDSContainer>
      </main>
      <LayoutFooter showCookies={setShowCookieDialog} />
    </div>
  )
}
