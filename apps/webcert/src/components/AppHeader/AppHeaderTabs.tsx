import classNames from 'classnames'
import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { UserTab } from '../../types'
import { NumberCircle } from '../utils/NumberCircle'

const Wrapper = styled.nav`
  button {
    display: inline;
    margin-right: 48px;
  }

  .tab_link {
    cursor: pointer;
  }
`

export interface Props {
  tabs: UserTab[]
  onSwitchTab?: (tab: number) => void
}

const AppHeaderTabs: React.FC<Props> = ({ tabs, onSwitchTab }) => {
  const match = useRouteMatch()

  const switchTab = (tab: UserTab) => {
    if (match.url !== tab.url) {
      if (onSwitchTab) {
        onSwitchTab(tabs.findIndex((t) => t === tab))
      }
    }
  }

  if (!tabs || tabs.length === 0) {
    return null
  }

  const isSelectedTab = (tab: UserTab) => {
    return match.url.includes(tab.url) || tab.matchedUrls.some((url) => match.url.startsWith(url))
  }

  return (
    <Wrapper className="ic-topnav iu-pb-300">
      <ul className="ic-container">
        {tabs.map((tab) => {
          return (
            <li className="ic-topnav__item iu-display-flex" key={tab.title}>
              <Link
                to={tab.url}
                className={classNames('tab_link ic-topnav__link iu-fs-400 iu-py-100 iu-mb-200', { selected: isSelectedTab(tab) })}
                onClick={() => switchTab(tab)}
              >
                <span>{tab.title}</span>
                {!!tab.number && <NumberCircle number={tab.number} type="secondary" />}
              </Link>
            </li>
          )
        })}
      </ul>
    </Wrapper>
  )
}

export default AppHeaderTabs
