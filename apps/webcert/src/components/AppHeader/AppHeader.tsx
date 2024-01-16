import { UserTab } from '@frontend/common/types'
import React from 'react'
import styled from 'styled-components'
import AppHeaderTabs from './AppHeaderTabs'
import AppHeaderTitle from './AppHeaderTitle'

const HeaderInner = styled.div`
  height: unset;
  padding: 15px 0;
`

const SecondaryList = styled.ul`
  height: 100%;
  gap: 0.625rem;
`

const SecondaryListItem = styled.li`
  display: flex;
  align-items: center;

  :not(:last-child) {
    border-right: 1px solid #01a5a3;
    padding-right: 0.625rem;
  }
`

const UserMenu = styled.div`
  align-items: stretch;
`

export interface Props {
  title?: React.ReactNode
  primaryItems?: React.ReactNode[]
  secondaryItems?: React.ReactNode[]
  logo?: string
  alt?: string
  banners?: React.ReactNode[]
  tabs?: UserTab[]
  onSwitchTab?: (tab: number) => void
  subMenuBanners?: React.ReactNode[]
}

const AppHeader: React.FC<Props> = ({
  title,
  primaryItems,
  secondaryItems,
  logo,
  alt,
  banners,
  tabs = [],
  onSwitchTab,
  subMenuBanners,
}) => {
  const getPrimary = () => {
    return primaryItems?.map((item, index) => <React.Fragment key={index}>{item}</React.Fragment>)
  }

  const getSecondary = () => {
    return secondaryItems?.map((item, index) => <SecondaryListItem key={index}>{item}</SecondaryListItem>)
  }

  return (
    <>
      {banners}
      <header className="ic-page-header">
        <HeaderInner className="ic-page-header__inner">
          {title && title}
          {logo && <AppHeaderTitle imgSrc={logo} alt={alt} />}
          <UserMenu className="ic-page-header__item iu-mr-900 iu-lh-narrow">
            {getPrimary()}
            <nav aria-label="Användarmeny">
              <SecondaryList className="ic-link-list--nav iu-ml-400">{getSecondary()}</SecondaryList>
            </nav>
          </UserMenu>
        </HeaderInner>
        <AppHeaderTabs tabs={tabs} onSwitchTab={onSwitchTab} />
        {subMenuBanners}
      </header>
    </>
  )
}

export default AppHeader
