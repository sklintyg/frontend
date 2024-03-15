import React, { useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { AlertCircle } from '../../images'
import { updateIsCareProviderModalOpen } from '../../store/user/userActions'
import {
  getTotalDraftsAndUnhandledQuestionsOnOtherUnits,
  getUser,
  getUserResourceLinks,
  isPrivatePractitioner,
} from '../../store/user/userSelectors'
import { ResourceLinkType, User } from '../../types'
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

const WebcertHeaderUnit: React.FC<Props> = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser, shallowEqual)
  const totalDraftsAndUnhandledQuestionsOnOtherUnits = useSelector(getTotalDraftsAndUnhandledQuestionsOnOtherUnits)
  const userLinks = useSelector(getUserResourceLinks)
  const changeUnitLink = userLinks?.find((link) => link.type === ResourceLinkType.CHANGE_UNIT)
  const showUnhandledQuestionsInfo = !!changeUnitLink && totalDraftsAndUnhandledQuestionsOnOtherUnits > 0
  const privatePractitioner = useSelector(isPrivatePractitioner)

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
