import { IDSHeaderAvatar } from '@frontend/ids-react-ts'
import { useLogout } from '../../../hooks/useLogout'
import { useGetUserQuery } from '../../../store/api'

export function LayoutHeaderAvatar() {
  const logout = useLogout()
  const { data: user } = useGetUserQuery()

  return (
    <IDSHeaderAvatar username={user?.personName ?? ''}>
      <button type="button" slot="avatar-left">
        Inställningar
      </button>
      <button type="button" slot="avatar-right" onClick={logout}>
        Logga ut
      </button>
    </IDSHeaderAvatar>
  )
}
