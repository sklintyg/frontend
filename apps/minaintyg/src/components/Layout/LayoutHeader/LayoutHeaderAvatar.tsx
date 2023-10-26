import { IDSHeaderAvatar } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useGetUserQuery } from '../../../store/api'
import { resolveNavigationUrl } from '../../../utils/resolveNavigationUrl'
import settingsUrl from './data/settings-url.json'

export function LayoutHeaderAvatar() {
  const { data: user } = useGetUserQuery()

  return (
    <IDSHeaderAvatar username={user?.personName ?? ''}>
      <a href={resolveNavigationUrl(settingsUrl)} target="_self" slot="avatar-left">
        Inställningar
      </a>
      <Link to="/logout" slot="avatar-right">
        Logga ut
      </Link>
    </IDSHeaderAvatar>
  )
}
