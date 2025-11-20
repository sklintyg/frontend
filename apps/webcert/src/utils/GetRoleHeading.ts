import { getUser, getUserResourceLink } from '../store/user/userSelectors'
import { type ResourceLink, ResourceLinkType } from '../types'
import { useAppSelector } from '../store/store'

export function GetRoleHeading(): string | ResourceLink | null {
  const registerLink = useAppSelector(getUserResourceLink(ResourceLinkType.ACCESS_REGISTER_PRIVATE_PRACTITIONER))
  const editLink = useAppSelector(getUserResourceLink(ResourceLinkType.ACCESS_EDIT_PRIVATE_PRACTITIONER))
  const notAuthorizedLink = useAppSelector(getUserResourceLink(ResourceLinkType.NOT_AUTHORIZED_PRIVATE_PRACTITIONER))
  const user = useAppSelector(getUser)

  if (notAuthorizedLink && notAuthorizedLink.enabled) {
    return 'Ej behörig'
  } else if (registerLink && registerLink.enabled) {
    return 'Ej registrerad'
  } else if (editLink && editLink.enabled) {
    return '' // FIXME: Placeholder, should be replaced with a proper link
  } else {
    return user?.role ?? null
  }
}
