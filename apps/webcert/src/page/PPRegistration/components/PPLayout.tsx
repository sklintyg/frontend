import type { ReactNode } from 'react'
import AppHeader from '../../../components/AppHeader/AppHeader'
import { UserHeaderMenu, UserHeaderMenuItem } from '../../../components/AppHeader/UserHeaderMenu'
import SystemBanners from '../../../components/notification/SystemBanners'
import logo from '../../../images/webcert_logo.png'
import { SubHeader } from './SubHeader'

export function PPLayout({ subHeader, children }: { subHeader: string; children: ReactNode }) {
  return (
    <>
      <AppHeader
        logo={logo}
        alt="Webcert"
        secondaryUserMenu={
          <UserHeaderMenu>
            <UserHeaderMenuItem>{/* <CreateAccount key="create-account" url={config.ppHost} /> */}</UserHeaderMenuItem>
          </UserHeaderMenu>
        }
        banners={[<SystemBanners key="system-banners" />]}
      />
      <SubHeader>{subHeader}</SubHeader>
      <div className="px-10 pt-5">
        <div className="w-[620px]">{children}</div>
      </div>
    </>
  )
}
