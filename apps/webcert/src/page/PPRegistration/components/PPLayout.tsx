import { Outlet } from 'react-router-dom'
import AppHeader from '../../../components/AppHeader/AppHeader'
import { UserHeaderMenu, UserHeaderMenuItem } from '../../../components/AppHeader/UserHeaderMenu'
import SystemBanners from '../../../components/notification/SystemBanners'
import logo from '../../../images/webcert_logo.png'
import { useGetHOSPInformationQuery } from '../../../store/pp/ppApi'

export function PPLayout() {
  useGetHOSPInformationQuery()

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
      <Outlet />
    </>
  )
}
