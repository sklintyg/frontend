import React, { useEffect, useState } from 'react'
import { UserTab } from '../../types/utils'
import styled from 'styled-components'
import { useHistory, useRouteMatch } from 'react-router-dom'
import NumberCircle from '../utils/NumberCircle'
import classNames from 'classnames'
import { useKeyPress } from '../../utils/userFunctionUtils'
import { resetPatientState } from '@frontend/webcert/src/store/patient/patientActions'
import { useDispatch } from 'react-redux'
import { resetListState } from '@frontend/webcert/src/store/list/listActions'

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
}

const AppHeaderTabs: React.FC<Props> = ({ tabs }) => {
  const history = useHistory()
  const match = useRouteMatch()
  const [focusedTab, setFocusedTab] = useState<UserTab | null>(null)
  const enterPress = useKeyPress('Enter')
  const dispatch = useDispatch()

  useEffect(() => {
    if (focusedTab) {
      handleClick(focusedTab)
    }
  }, [enterPress])

  if (!tabs || tabs.length === 0) {
    return null
  }

  const isSelectedTab = (tab: UserTab) => {
    return match.url.includes(tab.url) || tab.matchedUrls.some((url) => match.url.startsWith(url))
  }

  const handleClick = (tab: UserTab) => {
    if (match.url !== tab.url) {
      dispatch(resetPatientState())
      dispatch(resetListState())
      history.push(tab.url)
    }
  }

  const handleFocus = (tab: UserTab) => {
    setFocusedTab(tab)
  }

  const getTabs = () => {
    return tabs.map((tab, index) => {
      return (
        <li className="ic-topnav__item iu-display-flex" key={'tab-' + index}>
          <a
            tabIndex={0}
            className={classNames('tab_link ic-topnav__link iu-fs-400 iu-py-100 iu-mb-200', { selected: isSelectedTab(tab) })}
            onFocus={() => handleFocus(tab)}
            onClick={() => handleClick(tab)}>
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
