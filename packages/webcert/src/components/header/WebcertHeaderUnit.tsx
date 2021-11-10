import React from 'react'
import { AppHeaderUser } from '@frontend/common'
import { AppHeaderUserUnit } from '@frontend/common'
import { getUser } from '../../store/user/userSelectors'
import { shallowEqual, useSelector } from 'react-redux'
import { User } from '@frontend/common/src'
import styled from 'styled-components'

const Italic = styled.span`
  font-style: italic;
  font-size: 13px;
`

const WebcertHeaderUnit: React.FC = () => {
  const user = useSelector(getUser, shallowEqual)

  const toString = (user: User): React.ReactNode => {
    return (
      <p>
        {user.loggedInCareProvider.unitName} <br /> <Italic>{user.loggedInUnit.unitName}</Italic>
      </p>
    )
  }

  if (!user) return null

  return (
    <>
      <AppHeaderUserUnit items={toString(user)} />
    </>
  )
}

export default WebcertHeaderUnit
