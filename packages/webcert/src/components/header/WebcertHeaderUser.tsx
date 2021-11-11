import React from 'react'
import { AppHeaderUser } from '@frontend/common'
import { getUser } from '../../store/user/userSelectors'
import { shallowEqual, useSelector } from 'react-redux'
import styled from 'styled-components'
import ProtectedPersonDoctorModal from '../../feature/certificate/Modals/ProtectedPersonDoctorModal'
import { User } from '@frontend/common/src'

const Italic = styled.span`
  font-style: italic;
  font-size: 13px;
`

const WebcertHeaderUser: React.FC = () => {
  const user = useSelector(getUser, shallowEqual)

  const toString = (user: User): React.ReactNode => {
    return (
      <div>
        {user.name} <br /> <Italic>{user.role}</Italic>
        {user.protectedPerson && <ProtectedPersonDoctorModal />}
      </div>
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
