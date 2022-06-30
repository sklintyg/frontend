import React from 'react'
import { AppHeaderUser } from '@frontend/common'
import { getUser } from '../../store/user/userSelectors'
import { shallowEqual, useSelector } from 'react-redux'
import ProtectedPersonDoctorModal from '../../feature/certificate/Modals/ProtectedPersonDoctorModal'
import { User } from '@frontend/common/src'
import ProtectedUserApprovalModal from '../../feature/certificate/Modals/ProtectedUserApprovalModal'
import userImage from '@frontend/common/src/images/user-image.svg'
import lock from '@frontend/common/src/images/lock-closed.svg'

const WebcertHeaderUser: React.FC = () => {
  const user = useSelector(getUser, shallowEqual)
  const protectedUserApprovalKey = 'wc.vardperson.sekretess.approved'
  const showProtectedUserApprovalModal = user?.preferences?.[protectedUserApprovalKey] !== 'true' && user?.protectedPerson

  const toString = (user: User): React.ReactNode => {
    return (
      <div>
        <p>
          {user.name} - {user.role}{' '}
        </p>
        {user.protectedPerson && <ProtectedPersonDoctorModal />}
      </div>
    )
  }

  if (!user) return null

  return (
    <>
      <ProtectedUserApprovalModal showModal={showProtectedUserApprovalModal as boolean} preferenceKey={protectedUserApprovalKey} />
      <AppHeaderUser items={toString(user)} image={user?.protectedPerson ? lock : userImage} />
    </>
  )
}

export default WebcertHeaderUser
