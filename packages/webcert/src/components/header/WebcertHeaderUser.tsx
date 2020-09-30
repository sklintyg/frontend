import React from 'react'
import { AppHeaderUser, mockGetUserSelector } from '@frontend/common'
import { AppHeaderUserUnit } from '@frontend/common'

const WebcertHeaderUser: React.FC = (props) => {
  return (
    <>
      <AppHeaderUser getUserSelector={mockGetUserSelector} />
      <AppHeaderUserUnit getUserSelector={mockGetUserSelector}></AppHeaderUserUnit>
    </>
  )
}

export default WebcertHeaderUser
