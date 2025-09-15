import { HeaderAvatarLink } from '@frontend/components'
import { getSettingsUrl } from '@frontend/components/1177'
import { IDSHeader1177Avatar } from '@inera/ids-react'
import { useGetUserQuery } from '../../store/hooks'

export function LayoutHeaderAvatar({ settingLink }: { settingLink?: { id: string; name: string; url: string } }) {
  const { data: user } = useGetUserQuery()

  const fallbackLink = {
    id: '99',
    name: 'Inställningar',
    url: getSettingsUrl(import.meta.env.MODE),
  }

  const linkToUse = settingLink ?? fallbackLink

  if (!user) {
    return null
  }

  return (
    <IDSHeader1177Avatar
      username={user.personName}
      links={
        <>
          <HeaderAvatarLink icon="settings" to={linkToUse.url}>
            {linkToUse.name}
          </HeaderAvatarLink>
          <HeaderAvatarLink icon="user" to="/logga-ut">
            Logga ut
          </HeaderAvatarLink>
        </>
      }
    />
  )
}
