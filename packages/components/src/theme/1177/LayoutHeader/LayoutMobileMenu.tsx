import { IDSHeader1177MenuMobile, IDSMobileMenu } from '@inera/ids-react'
import { useInRouterContext } from 'react-router-dom'
import { MobileMenuItem } from '../../../header'

export function LayoutMobileMenu({
  links,
  activeLink,
}: {
  links: Array<{ id: string; name: string; url: string }>
  activeLink?: string
}) {
  const inRouterContext = useInRouterContext()

  if (!inRouterContext) {
    return null
  }

  return (
    <IDSHeader1177MenuMobile>
      <IDSMobileMenu>
        {links.map((item) => (
          <MobileMenuItem key={item.id} to={item.url} title={item.name} active={activeLink === item.name} />
        ))}
      </IDSMobileMenu>
    </IDSHeader1177MenuMobile>
  )
}
