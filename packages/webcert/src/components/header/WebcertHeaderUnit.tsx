import React, { useState } from 'react'
import { AppHeaderUserUnit, ResourceLinkType } from '@frontend/common'
import { getTotalDraftsAndUnhandledQuestionsOnOtherUnits, getUser, getUserResourceLinks } from '../../store/user/userSelectors'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { User } from '@frontend/common/src'
import styled from 'styled-components'
import AlertCircle from '@frontend/common/src/images/AlertCircle'
import arrow from '@frontend/common/src/images/arrow-down.svg'
import { updateIsCareProviderModalOpen } from '../../store/user/userActions'

const ArrowDown = styled.img`
  cursor: pointer;
  width: 0.9em;
  display: inline-block;
`

const ArrowUp = styled(ArrowDown)`
  transform: rotate(180deg);
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
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

const StyledButton = styled.button`
  border: none;
`

const Link = styled.button`
  text-decoration: none;
`

const ExpandedDiv = styled.div`
  position: absolute;
  background: #ffffff;
  padding: 1.2em 2em;
  box-shadow: 1px 1px 10px #ccc;
  right: -11px;
  margin-top: 0.5em;
  border-radius: 3px;
  z-index: 9999;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    background: #ffffff;
    transform: rotate(45deg);
    position: absolute;
    top: -5px;
    right: 12px;
  }
`

const RelativeDiv = styled.div`
  position: relative;
`

const WebcertHeaderUnit: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser, shallowEqual)
  const totalDraftsAndUnhandledQuestionsOnOtherUnits = useSelector(getTotalDraftsAndUnhandledQuestionsOnOtherUnits)
  const userLinks = useSelector(getUserResourceLinks)
  const [isExpanded, setIsExpanded] = useState(false)

  const changeUnitLink = userLinks?.find((link) => link.type === ResourceLinkType.CHANGE_UNIT)

  const toggleMenu = () => {
    setIsExpanded(!isExpanded)
  }

  const expandButton = () => {
    if (changeUnitLink) {
      return (
        <StyledButton onClick={toggleMenu} tabIndex={0} className="iu-ml-300" data-testid="expandChangeUnit">
          {isExpanded ? (
            <ArrowUp src={arrow} alt="" data-testid="expandArrow" />
          ) : (
            <ArrowDown src={arrow} alt="" data-testid="expandArrow" />
          )}
        </StyledButton>
      )
    }
  }

  const openModal = () => {
    if (changeUnitLink) {
      dispatch(updateIsCareProviderModalOpen(true))
      setIsExpanded(false)
    }
  }

  const toString = (user: User): React.ReactNode => {
    return (
      <RelativeDiv>
        <Wrapper>
          <span>
            {user.loggedInCareProvider.unitName} - {user.loggedInUnit.unitName}
            <br />
            <Italic>
              {changeUnitLink &&
                `${totalDraftsAndUnhandledQuestionsOnOtherUnits} ej hanterade ärenden och ej signerade utkast på andra vårdenheter.`}
            </Italic>
          </span>
          {user.loggedInUnit.isInactive ? (
            <InactiveUnit
              className="iu-ml-400"
              data-tip="Enheten är markerad som inaktiv i journalsystemet, vilket innebär att viss funktionalitet ej är tillgänglig.">
              <AlertCircle />
              <span>Inaktiv enhet</span>
            </InactiveUnit>
          ) : null}
          {expandButton()}
        </Wrapper>
        {isExpanded && (
          <ExpandedDiv>
            <Link className="ic-link" type="button" onClick={openModal}>
              {!!changeUnitLink && changeUnitLink.name}
            </Link>
          </ExpandedDiv>
        )}
      </RelativeDiv>
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
