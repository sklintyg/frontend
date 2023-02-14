import { AlertCircle, ResourceLinkType, User } from '@frontend/common'
import React, { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { updateIsCareProviderModalOpen } from '../../store/user/userActions'
import {
  getTotalDraftsAndUnhandledQuestionsOnOtherUnits,
  getUser,
  getUserResourceLinks,
  isPrivatePractitioner,
} from '../../store/user/userSelectors'
import AppHeaderUserUnit from '../AppHeader/AppHeaderUserUnit'

const Wrapper = styled.div<Props>`
  display: flex;
  align-items: center;
  cursor: ${(props) => (props.changeUnitLinkPointer ? 'pointer' : 'default')};
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
  changeUnitLinkPointer: boolean
}

const WebcertHeaderUnit: React.FC<Props> = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser, shallowEqual)
  const totalDraftsAndUnhandledQuestionsOnOtherUnits = useSelector(getTotalDraftsAndUnhandledQuestionsOnOtherUnits)
  const userLinks = useSelector(getUserResourceLinks)
  const changeUnitLink = userLinks?.find((link) => link.type === ResourceLinkType.CHANGE_UNIT)
  const showUnhandledQuestionsInfo = !!changeUnitLink && totalDraftsAndUnhandledQuestionsOnOtherUnits > 0
  const privatePractitioner = useSelector(isPrivatePractitioner)

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  const openModal = () => {
    dispatch(updateIsCareProviderModalOpen(true))
  }

  const toString = (user: User): React.ReactNode => {
    return (
      <Wrapper changeUnitLinkPointer={!!changeUnitLink} onClick={changeUnitLink ? openModal : undefined} data-tip={changeUnitLink?.name}>
        <span>
          {!privatePractitioner && `${user.loggedInCareProvider.unitName} - `} {user.loggedInUnit.unitName}
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
            <span className="iu-ml-200">Inaktiv enhet</span>
          </InactiveUnit>
        )}
        {/* {changeUnitLink && <ExpandableBox linkText={changeUnitLink.name} onClickLink={openModal} />} */}
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
