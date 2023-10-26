import { IDSHeaderAvatar } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useLogout } from '../../../hooks/useLogout'
import { useGetUserQuery } from '../../../store/api'

export function LayoutHeaderAvatar() {
  const logout = useLogout()
  const { data: user } = useGetUserQuery()

  return (
    <IDSHeaderAvatar username={user?.personName ?? ''}>
      <a href="https://e-tjanster.1177.se/mvk/settings.xhtml" target="_self" slot="avatar-left">
        Inställningar
      </a>
      <Link to="/logout" slot="avatar-right" onClick={logout}>
        Logga ut
      </Link>
    </IDSHeaderAvatar>
  )
}
