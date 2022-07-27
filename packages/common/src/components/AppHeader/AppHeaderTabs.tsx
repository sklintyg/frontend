import React, { useCallback, useEffect } from 'react'
import { UserTab } from '../../types/utils'
import styled from 'styled-components'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { NumberCircle } from '../utils/NumberCircle'
import classNames from 'classnames'

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
  activeTab?: number
}

const AppHeaderTabs: React.FC<Props> = ({ tabs, onSwitchTab, activeTab }) => {
  const history = useHistory()
  const match = useRouteMatch()

  const switchTab = useCallback(
    (tab: UserTab) => {
      if (match.url !== tab.url) {
        if (onSwitchTab) {
          onSwitchTab(tabs.findIndex((t) => t === tab))
        }
      }
    },
    [match.url, onSwitchTab, tabs]
  )

  useEffect(() => {
    if (activeTab !== undefined && activeTab >= 0) {
      const tab = tabs[activeTab]

      switchTab(tab)
      if (match.url !== tab.url) {
        history.push(tab.url)
      }
    }
  }, [activeTab, tabs, switchTab, history, match.url])

  if (!tabs || tabs.length === 0) {
    return null
  }

  const isSelectedTab = (tab: UserTab) => {
    return match.url.includes(tab.url) || tab.matchedUrls.some((url) => match.url.startsWith(url))
  }

  const getTabs = () => {
    return tabs.map((tab, index) => {
      return (
        <li className="ic-topnav__item iu-display-flex" key={'tab-' + index}>
          <Link
            to={tab.url}
            className={classNames('tab_link ic-topnav__link iu-fs-400 iu-py-100 iu-mb-200', { selected: isSelectedTab(tab) })}
            onClick={() => switchTab(tab)}>
            <span>{tab.title}</span>
            {!!tab.number && <NumberCircle number={tab.number} type="secondary" />}
          </Link>
        </li>
      )
    })
  }

  return (
    <Wrapper className="ic-topnav iu-pb-300">
      <ul className="ic-container">{getTabs()}</ul>
    </Wrapper>
  )
}

export default AppHeaderTabs
