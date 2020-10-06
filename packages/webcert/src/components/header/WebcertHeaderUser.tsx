import React from 'react'
import { AppHeaderUser } from '@frontend/common'
import { AppHeaderUserUnit } from '@frontend/common'
import { getUser } from '../../store/user/userSelectors'

const WebcertHeaderUser: React.FC = () => {
  return (
    <>
      <AppHeaderUser getUserSelector={getUser} />
      <AppHeaderUserUnit getUserSelector={getUser}></AppHeaderUserUnit>
    </>
  )
}

export default WebcertHeaderUser
