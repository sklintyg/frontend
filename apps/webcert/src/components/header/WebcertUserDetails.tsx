import { Link } from 'react-router-dom'
import styled from 'styled-components'
import type { User } from '../../types'
import type { RoleInfo } from '../../utils/RoleHeading'

const StyledSpan = styled.span`
  white-space: nowrap;

  button {
    font-style: italic;
  }
`

interface WebcertUserDetailsProps {
  user: User
  label: string
  status: RoleInfo['status']
  editLinkEnabled: boolean
}

export function WebcertUserDetails({ user, label, status, editLinkEnabled }: WebcertUserDetailsProps) {
  if (status === 'normal') {
    return (
      <>
        <div className="flex items-center gap-1.5">
          <span>{user.name}</span>
          <span>- {label}</span>
        </div>
        {editLinkEnabled && (
          <div>
            <Link to="/edit">Ändra uppgifter</Link>
          </div>
        )}
      </>
    )
  }

  if (status === 'notAuthorized') {
    return (
      <>
        <div>
          <span>{user.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <StyledSpan>{label}</StyledSpan>
          {editLinkEnabled && (
            <>
              <span>|</span>
              <Link to="/edit">Ändra uppgifter</Link>
            </>
          )}
        </div>
      </>
    )
  }

  if (status === 'notRegistered') {
    return (
      <>
        <div>
          <span>{user.name}</span>
        </div>
        <div>
          <StyledSpan>{label}</StyledSpan>
        </div>
      </>
    )
  }
}
