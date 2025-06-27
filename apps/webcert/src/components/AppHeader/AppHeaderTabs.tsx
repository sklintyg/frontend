import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import type { UserTab } from '../../types'
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

const AppHeaderTabs = ({ tabs, onSwitchTab }: Props) => {
  const location = useLocation()
  const isSelectedTab = (tab: UserTab) => {
    return location.pathname === tab.url || tab.matchedUrls.some((url) => location.pathname.startsWith(url))
  }

  const switchTab = (tab: UserTab) => {
    if (location.pathname !== tab.url && onSwitchTab) {
      onSwitchTab(tabs.findIndex((t) => t === tab))
    }
  }

  if (!tabs || tabs.length === 0) {
    return null
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
