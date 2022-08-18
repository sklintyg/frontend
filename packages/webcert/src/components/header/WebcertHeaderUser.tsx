import React from 'react'
import { AppHeaderUser, ExpandableBox, ResourceLinkType, User } from '@frontend/common'
import { getUser, getUserResourceLinks } from '../../store/user/userSelectors'
import { shallowEqual, useSelector } from 'react-redux'
import ProtectedPersonDoctorModal from '../../feature/certificate/Modals/ProtectedPersonDoctorModal'
import ProtectedUserApprovalModal from '../../feature/certificate/Modals/ProtectedUserApprovalModal'
import userImage from '@frontend/common/src/images/user-image.svg'
import lock from '@frontend/common/src/images/lock-closed.svg'
import styled from 'styled-components'
import { getConfig } from '../../store/utils/utilsSelectors'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const UserRole = styled.span`
  font-style: italic;
  white-space: nowrap;
`

const WebcertHeaderUser: React.FC = () => {
  const user = useSelector(getUser, shallowEqual)
  const userLinks = useSelector(getUserResourceLinks)
  const { ppHost } = useSelector(getConfig)
  const protectedUserApprovalKey = 'wc.vardperson.sekretess.approved'
  const showProtectedUserApprovalModal = user?.preferences?.[protectedUserApprovalKey] !== 'true' && user?.protectedPerson
  const privatePractitionerPortal = userLinks?.find((link) => link.type === ResourceLinkType.PRIVATE_PRACTITIONER_PORTAL)

  const goToPrivatePractitionerPortal = () => {
    window.open(`${ppHost}?from=${window.location.href}`, '_blank')
  }

  const toString = (user: User): React.ReactNode => {
    return (
      <Wrapper>
        <UserWrapper>
          <span>{`${user.name} - ${user.role}`}</span>
          <UserRole>{user.protectedPerson && <ProtectedPersonDoctorModal />}</UserRole>
        </UserWrapper>

        {privatePractitionerPortal && (
          <ExpandableBox linkText={privatePractitionerPortal.name} onClickLink={goToPrivatePractitionerPortal} />
        )}
      </Wrapper>
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
