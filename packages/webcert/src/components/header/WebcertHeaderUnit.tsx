import React from 'react'
import { AppHeaderUserUnit } from '@frontend/common'
import { getUser } from '../../store/user/userSelectors'
import { shallowEqual, useSelector } from 'react-redux'
import { User } from '@frontend/common/src'
import styled from 'styled-components'
import AlertCircle from '@frontend/common/src/images/AlertCircle'

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
  const user = useSelector(getUser, shallowEqual)

  const toString = (user: User): React.ReactNode => {
    return (
      <Wrapper>
        <span>
          {user.loggedInCareProvider.unitName} <br />
          <Italic>{user.loggedInUnit.unitName}</Italic>
        </span>
        {user.loggedInUnit.isInactive ? (
          <InactiveUnit
            className="iu-ml-400"
            data-tip="Enheten är markerad som inaktiv i journalsystemet, vilket innebär att viss funktionalitet ej är tillgänglig.">
            <AlertCircle />
            <span>Inaktiv enhet</span>
          </InactiveUnit>
        ) : null}
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
