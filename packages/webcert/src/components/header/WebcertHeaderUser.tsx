import React from 'react'
import { AppHeaderUser, mockGetUserSelector } from '@frontend/common'
import { AppHeaderUserUnit } from '@frontend/common/src'

const WebcertHeaderUser: React.FC = (props) => {
  return (
    <>
      <AppHeaderUser getUserSelector={mockGetUserSelector} />
      <AppHeaderUserUnit getUserSelector={mockGetUserSelector}></AppHeaderUserUnit>
    </>
  )
}

export default WebcertHeaderUser
