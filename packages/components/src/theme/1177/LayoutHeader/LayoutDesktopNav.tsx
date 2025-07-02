import { IDSHeader1177Nav } from '@inera/ids-react'
import { useInRouterContext } from 'react-router-dom'
import { getNavigation, getNavigationItemUrl } from '../navigation'
import { LayoutDesktopNavItem } from './LayoutDesktopNavItem'

export function LayoutDesktopNav({ mode, activeLink }: { mode: string; activeLink?: string }) {
  const inRouterContext = useInRouterContext()

  if (!inRouterContext) {
    return null
  }

  return (
    <IDSHeader1177Nav>
      {getNavigation().map((item) => (
        <LayoutDesktopNavItem key={item.id} to={getNavigationItemUrl(item, mode)} title={item.name} active={activeLink === item.name} />
      ))}
    </IDSHeader1177Nav>
  )
}
