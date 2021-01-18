import React from 'react'
import AppHeaderAvatarBox from './AppHeaderAvatarBox'
import { Link } from 'react-router-dom'

interface Props {
  title: React.ReactNode
  primaryItems?: React.ReactNode
  secondaryItems?: React.ReactNode[]
}

const AppHeader: React.FC<Props> = (props) => {
  const getSecondary = () => {
    return props.secondaryItems?.map((item, index) => <li key={index}>{item}</li>)
  }

  return (
    <header className="ic-page-header">
      <div className="ic-page-header__inner">
        <div className="ic-page-header__item ic-page-header__logo-container">
          <Link className="ic-page-header__logo-link" to="#/">
            <span className="ic-page-header__logo-link-text"> [1177/Inera] </span>
          </Link>
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
