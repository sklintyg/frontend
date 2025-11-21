import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import AppHeader from '../../../components/AppHeader/AppHeader'
import { UserHeaderMenu, UserHeaderMenuItem } from '../../../components/AppHeader/UserHeaderMenu'
import SystemBanners from '../../../components/notification/SystemBanners'
import logo from '../../../images/webcert_logo.png'
import { useGetHOSPInformationQuery } from '../../../store/pp/ppApi'
import { useAppSelector } from '../../../store/store'

export function PPLayout() {
  useGetHOSPInformationQuery()
  const location = useLocation()
  const navigate = useNavigate()
  const hasSomeStepOneData = useAppSelector((state) => Object.values(state.ui.pp.step01.data).some(Boolean))

  useEffect(() => {
    if (location.pathname !== '/register/step-1' && !hasSomeStepOneData) {
      navigate('/register/step-1')
    }
  })

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
