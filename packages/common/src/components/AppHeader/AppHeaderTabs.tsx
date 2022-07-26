import React, { useEffect } from 'react'
import { UserTab } from '../../types/utils'
import styled from 'styled-components'
import { useHistory, useRouteMatch } from 'react-router-dom'
import NumberCircle from '../utils/NumberCircle'
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

  useEffect(() => {
    if (activeTab !== undefined && activeTab >= 0) {
      switchTab(tabs[activeTab])
    }
  }, [activeTab])

  if (!tabs || tabs.length === 0) {
    return null
  }

  const isSelectedTab = (tab: UserTab) => {
    return match.url.includes(tab.url) || tab.matchedUrls.some((url) => match.url.startsWith(url))
  }

  const switchTab = (tab: UserTab) => {
    if (match.url !== tab.url) {
      if (onSwitchTab) {
        onSwitchTab(tabs.findIndex((t) => t === tab))
      }
      history.push(tab.url)
    }
  }

  const clickHandler = (event: React.MouseEvent, tab: UserTab) => {
    event.preventDefault()
    switchTab(tab)
  }

  const getTabs = () => {
    return tabs.map((tab, index) => {
      return (
        <li className="ic-topnav__item iu-display-flex" key={'tab-' + index}>
          <a
            className={classNames('tab_link ic-topnav__link iu-fs-400 iu-py-100 iu-mb-200', { selected: isSelectedTab(tab) })}
            onClick={(event) => clickHandler(event, tab)}
            href="#">
            <span>{tab.title}</span>
            {!!tab.number && <NumberCircle number={tab.number} style="secondary" />}
          </a>
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
