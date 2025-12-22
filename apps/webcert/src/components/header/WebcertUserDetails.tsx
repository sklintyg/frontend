import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useAppSelector } from '../../store/store'
import { getUserResourceLink, isPrivatePractitioner } from '../../store/user/userSelectors'
import type { User } from '../../types'
import { ResourceLinkType } from '../../types'

const StyledSpan = styled.span`
  white-space: nowrap;
  font-style: italic;

  button {
    font-style: italic;
  }
`
interface WebcertUserDetailsProps {
  user: User
}

export function WebcertUserDetails({ user }: WebcertUserDetailsProps) {
  const notAuthorizedLink = useAppSelector(getUserResourceLink(ResourceLinkType.NOT_AUTHORIZED_PRIVATE_PRACTITIONER))
  const registerLink = useAppSelector(getUserResourceLink(ResourceLinkType.ACCESS_REGISTER_PRIVATE_PRACTITIONER))
  const editLink = useAppSelector(getUserResourceLink(ResourceLinkType.ACCESS_EDIT_PRIVATE_PRACTITIONER))
  const editLinkEnabled = !!editLink?.enabled
  const privatePractitioner = useAppSelector(isPrivatePractitioner)
  const displayRole = privatePractitioner ? 'Läkare' : user.role

  if (notAuthorizedLink?.enabled) {
    return (
      <>
        <div>
          <span>{user.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <StyledSpan>Ej behörig</StyledSpan>
          {editLinkEnabled && (
            <>
              <span>|</span>
              <Link className="underline" to="/edit">
                Ändra uppgifter
              </Link>
            </>
          )}
        </div>
      </>
    )
  }

  if (registerLink?.enabled) {
    return (
      <>
        <div>
          <span>{user.name}</span>
        </div>
        <div>
          <StyledSpan>Ej registrerad</StyledSpan>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex items-center gap-1.5">
        <span>{user.name}</span>
        <span>- {displayRole}</span>
      </div>
      {editLinkEnabled && (
        <div>
          <Link className="underline" to="/edit">
            Ändra uppgifter
          </Link>
        </div>
      )}
    </>
  )
}
