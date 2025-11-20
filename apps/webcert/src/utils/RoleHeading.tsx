import { getUser, getUserResourceLink } from '../store/user/userSelectors'
import { ResourceLinkType } from '../types'
import { useAppSelector } from '../store/store'
import type React from 'react'
import styled from 'styled-components'

const StyledText = styled.i`
  font-style: italic;
`

export function RoleHeading(): React.JSX.Element | null {
  const registerLink = useAppSelector(getUserResourceLink(ResourceLinkType.ACCESS_REGISTER_PRIVATE_PRACTITIONER))
  const editLink = useAppSelector(getUserResourceLink(ResourceLinkType.ACCESS_EDIT_PRIVATE_PRACTITIONER))
  const notAuthorizedLink = useAppSelector(getUserResourceLink(ResourceLinkType.NOT_AUTHORIZED_PRIVATE_PRACTITIONER))
  const user = useAppSelector(getUser)

  if (notAuthorizedLink?.enabled) {
    return <StyledText>Ej behörig</StyledText>
  } else if (registerLink?.enabled) {
    return <StyledText>Ej registrerad</StyledText>
  } else if (editLink?.enabled) {
    return (
      <a href={'/edit'} rel="noopener noreferrer">
        Ändra uppgifter
      </a>
    )
  } else {
    return <span>{user?.role ?? ''}</span>
  }
}
