import React from 'react'
import { AppHeaderUser } from '@frontend/common'
import { AppHeaderUserUnit } from '@frontend/common'
import { getUser } from '../../store/user/userSelectors'
import { useSelector } from 'react-redux'
import { User } from '@frontend/common/src'
import styled from 'styled-components'

const Italic = styled.span`
  font-style: italic;
  font-size: 13px;
`

const WebcertHeaderUnit: React.FC = () => {
  const user = useSelector(getUser)

  const toString = (user: User): React.ReactNode => {
    return (
      <p>
        {user.loggedInCareProvider} <br /> <Italic>{user.loggedInUnit}</Italic>
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
