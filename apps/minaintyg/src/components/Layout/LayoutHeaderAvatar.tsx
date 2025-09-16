import { HeaderAvatarLink } from '@frontend/components'
import { getSettingsUrl } from '@frontend/components/1177'
import { IDSHeader1177Avatar } from '@inera/ids-react'
import { useGetUserQuery } from '../../store/hooks'

export function LayoutHeaderAvatar({ environment }: { environment: string }) {
  const { data: user } = useGetUserQuery()

  if (!user) {
    return null
  }

  return (
    <IDSHeader1177Avatar
      username={user.personName}
      links={
        <>
          <HeaderAvatarLink icon="settings" to={getSettingsUrl(environment)}>
            Inställningar
          </HeaderAvatarLink>
          <HeaderAvatarLink icon="user" to="/logga-ut">
            Logga ut
          </HeaderAvatarLink>
        </>
      }
    />
  )
}
