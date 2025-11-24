import { getUser, getUserResourceLink } from '../store/user/userSelectors'
import { ResourceLinkType } from '../types'
import { useAppSelector } from '../store/store'

export interface RoleInfo {
  label: string
  status: 'notAuthorized' | 'notRegistered' | 'normal'
}

export function useRoleHeading(): RoleInfo {
  const registerLink = useAppSelector(getUserResourceLink(ResourceLinkType.ACCESS_REGISTER_PRIVATE_PRACTITIONER))
  const notAuthorizedLink = useAppSelector(getUserResourceLink(ResourceLinkType.NOT_AUTHORIZED_PRIVATE_PRACTITIONER))
  const user = useAppSelector(getUser)

  if (notAuthorizedLink?.enabled) {
    return { label: 'Ej behörig', status: 'notAuthorized' }
  }

  if (registerLink?.enabled) {
    return { label: 'Ej registrerad', status: 'notRegistered' }
  }

  return { label: user?.role ?? '', status: 'normal' }
}
