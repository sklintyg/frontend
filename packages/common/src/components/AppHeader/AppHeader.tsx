import React from 'react'
import AppHeaderTitle from './AppHeaderTitle'
import styled from 'styled-components'
import AppHeaderTabs from './AppHeaderTabs'
import { UserTab } from '../../types/utils'

const HeaderInner = styled.div`
  height: unset;
  padding: 15px 0;
`

const SecondaryList = styled.ul`
  gap: 0.625rem;
`

const SecondaryListItem = styled.li`
  :not(:last-child) {
    border-right: 1px solid #01a5a3;
    padding-right: 0.625rem;
  }
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
  activeTab?: number
}

const AppHeader: React.FC<Props> = ({ title, primaryItems, secondaryItems, logo, alt, banners, tabs = [], onSwitchTab, activeTab }) => {
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
          <div className="ic-page-header__item iu-mr-900 iu-lh-narrow">
            {getPrimary()}
            <nav aria-label="Användarmeny">
              <SecondaryList className="ic-link-list--nav iu-ml-400">{getSecondary()}</SecondaryList>
            </nav>
          </div>
        </HeaderInner>
        <AppHeaderTabs tabs={tabs} onSwitchTab={onSwitchTab} activeTab={activeTab} />
      </header>
    </>
  )
}

export default AppHeader
