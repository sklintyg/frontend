import { IDSHeader } from '@frontend/ids-react-ts'
import navigation from '../../../data/1177-navbar-services.json'
import { useGetUserQuery } from '../../../store/hooks'
import { resolveNavigationUrl } from '../../../utils/resolveNavigationUrl'
import { LayoutHeaderAvatar } from './LayoutHeaderAvatar'
import { LayoutHeaderNavigation } from './LayoutHeaderNavigation'

export function LayoutHeader() {
  const linkItem = navigation.menu.items.find(({ name }) => name === 'Start')
  const { data: user } = useGetUserQuery()

  return (
    <IDSHeader
      type="1177"
      logohref={linkItem && resolveNavigationUrl(linkItem.url)}
      hideregionpicker
      className="z-40 bg-white print:hidden"
    >
      {user && (
        <>
          <LayoutHeaderAvatar />
          <LayoutHeaderNavigation />
        </>
      )}
    </IDSHeader>
  )
}
