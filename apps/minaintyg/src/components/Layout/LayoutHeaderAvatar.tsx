import { HeaderAvatarLink } from '@frontend/components'
import { IDSHeader1177Avatar } from '@inera/ids-react'
import { useGetUserQuery } from '../../store/hooks'
import { useLinks } from '../../hooks/useLinks'

export function LayoutHeaderAvatar() {
  const { data: user } = useGetUserQuery()
  const settingLink = useLinks().find((link) => link.id === '99')

  if (!user) {
    return null
  }

  return (
    <IDSHeader1177Avatar
      username={user.personName}
      links={
        <>
          {settingLink && (
            <HeaderAvatarLink icon="settings" to={settingLink.url}>
              {settingLink.name}
            </HeaderAvatarLink>
          )}
          <HeaderAvatarLink icon="user" to="/logga-ut">
            Logga ut
          </HeaderAvatarLink>
        </>
      }
    />
  )
}
