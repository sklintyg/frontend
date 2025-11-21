import { getUser, getUserResourceLink } from '../store/user/userSelectors'
import { ResourceLinkType } from '../types'
import { useAppSelector } from '../store/store'
import type React from 'react'
import { Link } from 'react-scroll'

export function RoleHeading(): React.JSX.Element | null {
  const registerLink = useAppSelector(getUserResourceLink(ResourceLinkType.ACCESS_REGISTER_PRIVATE_PRACTITIONER))
  const editLink = useAppSelector(getUserResourceLink(ResourceLinkType.ACCESS_EDIT_PRIVATE_PRACTITIONER))
  const notAuthorizedLink = useAppSelector(getUserResourceLink(ResourceLinkType.NOT_AUTHORIZED_PRIVATE_PRACTITIONER))
  const user = useAppSelector(getUser)

  if (notAuthorizedLink?.enabled) {
    return <span className="italic">Ej behörig</span>
  } else if (registerLink?.enabled) {
    return <span className="italic">Ej registrerad</span>
  } else if (editLink?.enabled) {
    return <Link to="/edit">Ändra uppgifter</Link>
  } else {
    return <span>{user?.role ?? ''}</span>
  }
}
