import { ExpandableBox, lockClosedImage, ResourceLinkType, User, userImage } from '@frontend/common'
import React, { useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import styled from 'styled-components'
import ProtectedPersonDoctorModal from '../../feature/certificate/Modals/ProtectedPersonDoctorModal'
import ProtectedUserApprovalModal from '../../feature/certificate/Modals/ProtectedUserApprovalModal'
import { getUser, getUserResourceLinks } from '../../store/user/userSelectors'
import { getConfig } from '../../store/utils/utilsSelectors'
import AppHeaderUser from '../AppHeader/AppHeaderUser'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
const ExpandableBoxWrapper = styled.div<Props>`
  display: flex;
  align-items: center;
  cursor: ${(props) => (props.changeLinkPointer ? 'pointer' : 'default')};
`

const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledSpan = styled.span`
  white-space: nowrap;
  button {
    font-style: italic;
  }
`
interface Props {
  changeLinkPointer?: boolean
}

const WebcertHeaderUser: React.FC<Props> = () => {
  const user = useSelector(getUser, shallowEqual)
  const userLinks = useSelector(getUserResourceLinks)
  const { ppHost } = useSelector(getConfig)
  const protectedUserApprovalKey = 'wc.vardperson.sekretess.approved'
  const showProtectedUserApprovalModal = user?.preferences?.[protectedUserApprovalKey] !== 'true' && user?.protectedPerson
  const privatePractitionerPortal = userLinks?.find((link) => link.type === ResourceLinkType.PRIVATE_PRACTITIONER_PORTAL)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }
  const goToPrivatePractitionerPortal = () => {
    window.open(`${ppHost}?from=${window.location.href}`, '_blank')
  }

  const toString = (user: User): React.ReactNode => {
    return (
      <Wrapper>
        <ExpandableBoxWrapper onClick={handleClick} changeLinkPointer={!!privatePractitionerPortal}>
          <UserWrapper>
            <span>{`${user.name} - ${user.role}`}</span>
            {user.protectedPerson && (
              <StyledSpan>
                <ProtectedPersonDoctorModal />
              </StyledSpan>
            )}
          </UserWrapper>
          {privatePractitionerPortal && (
            <ExpandableBox linkText={privatePractitionerPortal.name} onClickLink={goToPrivatePractitionerPortal} isExpanded={isExpanded} />
          )}
        </ExpandableBoxWrapper>
      </Wrapper>
    )
  }

  if (!user) return null

  return (
    <>
      <ProtectedUserApprovalModal showModal={showProtectedUserApprovalModal as boolean} preferenceKey={protectedUserApprovalKey} />
      <AppHeaderUser items={toString(user)} image={user?.protectedPerson ? lockClosedImage : userImage} />
    </>
  )
}

export default WebcertHeaderUser
