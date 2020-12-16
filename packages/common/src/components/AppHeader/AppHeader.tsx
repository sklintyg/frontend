import React from 'react'
import AppHeaderAvatarBox from './AppHeaderAvatarBox'

interface Props {
  title: React.ReactNode
  primaryItems?: React.ReactNode
  secondaryItems?: React.ReactNode[]
}

const AppHeader: React.FC<Props> = (props) => {
  const getSecondary = () => {
    return props.secondaryItems?.map((item, index) => <li>{item}</li>)
  }

  return (
    <header className="ic-page-header">
      <div className="ic-page-header__inner">
        <div className="ic-page-header__item ic-page-header__logo-container">
          <a className="ic-page-header__logo-link" href="#/">
            <span className="ic-page-header__logo-link-text"> [1177/Inera] </span>
          </a>
        </div>
        <AppHeaderAvatarBox userItems={props.primaryItems} links={props.secondaryItems} />
      </div>
      <nav className="ic-nav iu-fs-200 iu-hide-from-lg ic-nav--full ic-nav--divider iu-bg-secondary-light">
        <ul className="ic-container">{getSecondary()}</ul>
      </nav>
    </header>
  )
}

export default AppHeader
