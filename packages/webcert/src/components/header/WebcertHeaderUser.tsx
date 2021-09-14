import React from 'react'
import { AppHeaderUser } from '@frontend/common'
import { getUser } from '../../store/user/userSelectors'
import { useSelector } from 'react-redux'
import { User } from '@frontend/common/src'
import styled from 'styled-components'

const Italic = styled.span`
  font-style: italic;
  font-size: 13px;
`

const WebcertHeaderUser: React.FC = () => {
  const user = useSelector(getUser)

  const toString = (user: User): React.ReactNode => {
    return (
      <p>
        {user.name} <br /> <Italic>{user.role}</Italic>
      </p>
    )
  }

  if (!user) return null

  return (
    <>
      <AppHeaderUser items={toString(user)} />
    </>
  )
}

export default WebcertHeaderUser
