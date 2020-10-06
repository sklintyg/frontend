import React from 'react'
import { AppHeaderUser } from '@frontend/common'
import { AppHeaderUserUnit } from '@frontend/common'
import { getUser } from '../../store/user/userSelectors'
import { useSelector } from 'react-redux'

const WebcertHeaderUser: React.FC = () => {
  const user = useSelector(getUser)

  if (!user) return null

  return (
    <>
      <AppHeaderUser user={user} />
      <AppHeaderUserUnit user={user}></AppHeaderUserUnit>
    </>
  )
}

export default WebcertHeaderUser
