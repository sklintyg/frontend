import styled from 'styled-components'
import type { UserTab } from '../../types'
import AppHeaderTabs from './AppHeaderTabs'
import AppHeaderTitle from './AppHeaderTitle'

const HeaderInner = styled.div`
  height: unset;
  padding: 15px 0;
`

const UserMenu = styled.div`
  align-items: stretch;
`

function AppHeader({
  title,
  primaryUserMenu,
  secondaryUserMenu,
  logo,
  alt,
  banners,
  tabs = [],
  onSwitchTab,
  subMenuBanners,
}: {
  title?: React.ReactNode
  primaryUserMenu?: React.ReactNode
  secondaryUserMenu?: React.ReactNode
  logo?: string
  alt?: string
  banners?: React.ReactNode[]
  tabs?: UserTab[]
  onSwitchTab?: (tab: number) => void
  subMenuBanners?: React.ReactNode[]
}) {
  return (
    <>
      {banners}
      <header className="ic-page-header">
        <HeaderInner className="ic-page-header__inner">
          {title}
          {logo && <AppHeaderTitle imgSrc={logo} alt={alt} />}
          <UserMenu className="ic-page-header__item iu-mr-900 iu-lh-narrow">
            {primaryUserMenu}
            <nav aria-label="Användarmeny">{secondaryUserMenu}</nav>
          </UserMenu>
        </HeaderInner>
        <AppHeaderTabs tabs={tabs} onSwitchTab={onSwitchTab} />
        {subMenuBanners}
      </header>
    </>
  )
}

export default AppHeader
