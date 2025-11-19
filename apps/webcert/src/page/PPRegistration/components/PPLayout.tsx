import type { ReactNode } from 'react'
import AppHeader from '../../../components/AppHeader/AppHeader'
import { UserHeaderMenu, UserHeaderMenuItem } from '../../../components/AppHeader/UserHeaderMenu'
import SystemBanners from '../../../components/notification/SystemBanners'
import Spinner from '../../../components/utils/Spinner'
import logo from '../../../images/webcert_logo.png'
import { useAppSelector } from '../../../store/store'
import { selectIsLoadingUser } from '../../../store/user/userSelectors'
import { SubHeader } from './SubHeader'

export function PPLayout({ subHeader, children }: { subHeader: string; children: ReactNode }) {
  const isLoadingUser = useAppSelector(selectIsLoadingUser)

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
        <div className="w-[620px]">{isLoadingUser ? <Spinner /> : children}</div>
      </div>
    </>
  )
}
