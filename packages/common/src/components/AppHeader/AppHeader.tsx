import React from 'react'
import AppHeaderTitle from './AppHeaderTitle'
import styled from 'styled-components'

const Header = styled.div`
  height: unset;
  padding: 15px 0;
`

interface Props {
  title?: React.ReactNode
  primaryItems?: React.ReactNode[]
  secondaryItems?: React.ReactNode[]
  logo?: string
  alt?: string
}

const AppHeader: React.FC<Props> = ({ title, primaryItems, secondaryItems, logo, alt }) => {
  const getPrimary = () => {
    return primaryItems?.map((item, index) => <React.Fragment key={index}>{item}</React.Fragment>)
  }

  const getSecondary = () => {
    return secondaryItems?.map((item, index) => <li key={index}>{item}</li>)
  }

  return (
    <header className="ic-page-header">
      <Header className="ic-page-header__inner">
        {title && title}
        {logo && <AppHeaderTitle imgSrc={logo} alt={alt}></AppHeaderTitle>}
        <div className="ic-page-header__item iu-mr-gutter">
          {getPrimary()}
          <ul className="ic-link-list--nav iu-mx-400">{getSecondary()}</ul>
        </div>
      </Header>
    </header>
  )
}

export default AppHeader
