import { IDSHeaderAvatar } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import settingsUrl from '../../../data/settings-url.json'
import { useGetUserQuery } from '../../../store/hooks'
import { resolveNavigationUrl } from '../../../utils/resolveNavigationUrl'

export function LayoutHeaderAvatar() {
  const { data: user } = useGetUserQuery()

  if (!user) {
    return null
  }

  return (
    <IDSHeaderAvatar username={user.personName}>
      <Link to={resolveNavigationUrl(settingsUrl)} slot="avatar-left">
        Inställningar
      </Link>
      <Link to="/logga-ut" slot="avatar-right">
        Logga ut
      </Link>
    </IDSHeaderAvatar>
  )
}
