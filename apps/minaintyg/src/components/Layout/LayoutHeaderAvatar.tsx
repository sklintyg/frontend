import { getSettingsUrl } from '@frontend/components/1177'
import { IDSHeaderAvatar } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useGetUserQuery } from '../../store/hooks'

export function LayoutHeaderAvatar() {
  const { data: user } = useGetUserQuery()

  if (!user) {
    return null
  }

  return (
    <IDSHeaderAvatar username={user.personName}>
      <Link to={getSettingsUrl(import.meta.env.MODE)} slot="avatar-left">
        Inställningar
      </Link>
      <Link to="/logga-ut" slot="avatar-right">
        Logga ut
      </Link>
    </IDSHeaderAvatar>
  )
}
