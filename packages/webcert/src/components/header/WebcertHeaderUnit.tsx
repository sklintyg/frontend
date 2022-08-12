import React from 'react'
import { AppHeaderUserUnit, ResourceLinkType, ExpandableBox, User } from '@frontend/common'
import { getTotalDraftsAndUnhandledQuestionsOnOtherUnits, getUser, getUserResourceLinks } from '../../store/user/userSelectors'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import AlertCircle from '@frontend/common/src/images/AlertCircle'
import { updateIsCareProviderModalOpen } from '../../store/user/userActions'

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

const WebcertHeaderUnit: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser, shallowEqual)
  const totalDraftsAndUnhandledQuestionsOnOtherUnits = useSelector(getTotalDraftsAndUnhandledQuestionsOnOtherUnits)
  const userLinks = useSelector(getUserResourceLinks)
  const changeUnitLink = userLinks?.find((link) => link.type === ResourceLinkType.CHANGE_UNIT)
  const showUnhandledQuestionsInfo = !!changeUnitLink && totalDraftsAndUnhandledQuestionsOnOtherUnits > 0

  const openModal = () => {
    dispatch(updateIsCareProviderModalOpen(true))
  }

  const toString = (user: User): React.ReactNode => {
    return (
      <Wrapper>
        <span>
          {user.loggedInCareProvider.unitName} - {user.loggedInUnit.unitName}
          <br />
          {showUnhandledQuestionsInfo && (
            <Italic>
              {totalDraftsAndUnhandledQuestionsOnOtherUnits} ej hanterade ärenden och ej signerade utkast på andra vårdenheter.
            </Italic>
          )}
        </span>
        {user.loggedInUnit.isInactive && (
          <InactiveUnit
            className="iu-ml-400"
            data-tip="Enheten är markerad som inaktiv i journalsystemet, vilket innebär att viss funktionalitet ej är tillgänglig.">
            <AlertCircle />
            <span>Inaktiv enhet</span>
          </InactiveUnit>
        )}
        {changeUnitLink && <ExpandableBox linkText={changeUnitLink.name} onClickLink={openModal} />}
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
