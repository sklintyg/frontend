import { IDSHeader1177Nav } from '@inera/ids-react'
import { useInRouterContext } from 'react-router-dom'
import { LayoutDesktopNavItem } from './LayoutDesktopNavItem'

export function LayoutDesktopNav({
  activeLink,
  links,
}: {
  activeLink?: string
  links: Array<{ id: string; name: string; url: string }>
}) {
  const inRouterContext = useInRouterContext()

  if (!inRouterContext) {
    return null
  }

  return (
    <IDSHeader1177Nav>
      {links.map((item) => (
        <LayoutDesktopNavItem key={item.id} to={item.url} title={item.name} active={activeLink === item.name} />
      ))}
    </IDSHeader1177Nav>
  )
}
