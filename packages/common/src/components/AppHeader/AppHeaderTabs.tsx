import React from 'react'
import { UserTab } from '../../types/utils'
import { CustomButton } from '@frontend/common'
import styled from 'styled-components'
import { useHistory, useRouteMatch } from 'react-router-dom'

const Wrapper = styled.nav`
  button {
    display: inline;
    margin-right: 48px;
  }
`

export interface Props {
  tabs: UserTab[]
}

const AppHeaderTabs: React.FC<Props> = ({ tabs }) => {
  const history = useHistory()
  const match = useRouteMatch()

  if (!tabs || tabs.length === 0) {
    return null
  }

  const isSelectedTab = (tab: UserTab) => {
    return match.url.includes(tab.url) || tab.matchedUrls.some((url) => match.url.startsWith(url))
  }

  const handleClick = (tab: UserTab, index: number) => {
    history.push(tab.url)
  }

  const getTabs = () => {
    return tabs.map((tab, index) => {
      return (
        <li className="ic-topnav__item" key={tab.title}>
          <CustomButton
            buttonStyle={isSelectedTab(tab) ? 'primary' : 'secondary'}
            rounded
            text={tab.title}
            number={tab.number && tab.number > 0 ? tab.number : undefined}
            onClick={() => handleClick(tab, index)}
          />
        </li>
      )
    })
  }

  return (
    <Wrapper className="ic-topnav iu-bg-muted-light iu-border-success-light">
      <ul className="ic-container iu-my-200">{getTabs()}</ul>
    </Wrapper>
  )
}

export default AppHeaderTabs
