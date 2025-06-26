import type React from 'react'
import { useState } from 'react'
import { shallowEqual } from 'react-redux'
import styled from 'styled-components'
import { AlertCircle } from '../../images'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { updateIsCareProviderModalOpen } from '../../store/user/userActions'
import {
  getTotalDraftsAndUnhandledQuestionsOnOtherUnits,
  getUser,
  getUserResourceLink,
  isPrivatePractitioner,
} from '../../store/user/userSelectors'
import type { User } from '../../types'
import { ResourceLinkType } from '../../types'
import AppHeaderUserUnit from '../AppHeader/AppHeaderUserUnit'
import ExpandableBox from '../utils/ExpandableBox'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
const ExpandableBoxWrapper = styled.div<Props>`
  display: flex;
  align-items: center;
  cursor: ${(props) => (props.changeUnitLinkPointer ? 'pointer' : 'default')};
  ${(props) =>
    props.changeUnitLinkPointer &&
    `
    &:focus {
      outline: 2px solid #a1958a;
    }
  `}
`
const Italic = styled.span`
  font-style: italic;
  font-size: 12px;
`

const InactiveUnit = styled.span`
  font-weight: bold;
  display: flex;
  align-items: center;
  cursor: default;
  font-size: 12px;
`
interface Props {
  changeUnitLinkPointer?: boolean
}

const WebcertHeaderUnit = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(getUser, shallowEqual)
  const totalDraftsAndUnhandledQuestionsOnOtherUnits = useAppSelector(getTotalDraftsAndUnhandledQuestionsOnOtherUnits)
  const changeUnitLink = useAppSelector(getUserResourceLink(ResourceLinkType.CHANGE_UNIT))
  const showUnhandledQuestionsInfo = !!changeUnitLink && totalDraftsAndUnhandledQuestionsOnOtherUnits > 0
  const privatePractitioner = useAppSelector(isPrivatePractitioner)

  const [isExpanded, setIsExpanded] = useState(false)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleClick()
    }
  }

  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }
  const openModal = () => {
    dispatch(updateIsCareProviderModalOpen(true))
  }

  const toString = (user: User): React.ReactNode => {
    return (
      <Wrapper>
        <ExpandableBoxWrapper
          onClick={changeUnitLink ? handleClick : undefined}
          changeUnitLinkPointer={!!changeUnitLink}
          data-testid="expandableBox"
          tabIndex={changeUnitLink ? 0 : -1}
          onKeyDown={changeUnitLink ? handleKeyDown : undefined}
        >
          <span>
            {!privatePractitioner && `${user.loggedInCareProvider.unitName} - `} {user.loggedInUnit.unitName}
            <br />
            {showUnhandledQuestionsInfo && (
              <Italic>
                {totalDraftsAndUnhandledQuestionsOnOtherUnits} ej hanterade ärenden och ej signerade utkast på andra vårdenheter
              </Italic>
            )}
          </span>
          {user.loggedInUnit.isInactive && (
            <InactiveUnit
              className="iu-ml-400"
              data-tip="Enheten är markerad som inaktiv i journalsystemet, vilket innebär att viss funktionalitet ej är tillgänglig."
            >
              <AlertCircle />
              <span className="iu-ml-200">Inaktiv enhet</span>
            </InactiveUnit>
          )}
          {changeUnitLink && <ExpandableBox linkText={changeUnitLink.name} onClickLink={openModal} isExpanded={isExpanded} />}
        </ExpandableBoxWrapper>
      </Wrapper>
    )
  }

  if (!user || !user.loggedInUnit.unitId) return null

  return (
    <>
      <AppHeaderUserUnit items={toString(user)} />
    </>
  )
}

export default WebcertHeaderUnit
