import React from 'react'
import { AppHeaderUser } from '@frontend/common'
import { AppHeaderUserUnit } from '@frontend/common'
import { getUser } from '../../store/user/userSelectors'
import { useSelector } from 'react-redux'
import { User } from '@frontend/common/src'

const WebcertHeaderUser: React.FC = () => {
  const user = useSelector(getUser)

  const toString = (user: User): string => {
    return user.name + ' - ' + user.role
  }

  if (!user) return null

  return (
    <>
      <AppHeaderUser text={toString(user)} />
      <AppHeaderUserUnit user={user} />
    </>
  )
}

export default WebcertHeaderUser
