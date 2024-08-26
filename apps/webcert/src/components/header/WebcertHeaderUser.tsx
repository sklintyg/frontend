import type React from 'react';
import { useState } from 'react'
import { shallowEqual } from 'react-redux'
import styled from 'styled-components'
import ProtectedPersonDoctorModal from '../../feature/certificate/Modals/ProtectedPersonDoctorModal'
import ProtectedUserApprovalModal from '../../feature/certificate/Modals/ProtectedUserApprovalModal'
import { lockClosedImage, userImage } from '../../images'
import { useAppSelector } from '../../store/store'
import { getUser, getUserResourceLink } from '../../store/user/userSelectors'
import { getConfig } from '../../store/utils/utilsSelectors'
import type { User } from '../../types';
import { ResourceLinkType } from '../../types'
import AppHeaderUser from '../AppHeader/AppHeaderUser'
import ExpandableBox from '../utils/ExpandableBox'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
const ExpandableBoxWrapper = styled.div<Props>`
  display: flex;
  align-items: center;
  cursor: ${(props) => (props.changeLinkPointer ? 'pointer' : 'default')};
  ${(props) =>
    props.changeLinkPointer &&
    `
    &:focus {
      outline: 2px solid #a1958a;
    }
  `}
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
  const user = useAppSelector(getUser, shallowEqual)
  const privatePractitionerPortal = useAppSelector(getUserResourceLink(ResourceLinkType.PRIVATE_PRACTITIONER_PORTAL))
  const ppHost = useAppSelector((state) => getConfig(state).ppHost)
  const protectedUserApprovalKey = 'wc.vardperson.sekretess.approved'
  const showProtectedUserApprovalModal = user?.preferences?.[protectedUserApprovalKey] !== 'true' && user?.protectedPerson
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleClick()
    }
  }

  const goToPrivatePractitionerPortal = () => {
    window.open(`${ppHost}?from=${window.location.pathname}`, '_blank')
  }

  const toString = (user: User): React.ReactNode => {
    return (
      <Wrapper>
        <ExpandableBoxWrapper
          onClick={handleClick}
          changeLinkPointer={!!privatePractitionerPortal}
          data-testid="expandableBox"
          tabIndex={privatePractitionerPortal ? 0 : -1}
          onKeyDown={privatePractitionerPortal ? handleKeyDown : undefined}
        >
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
