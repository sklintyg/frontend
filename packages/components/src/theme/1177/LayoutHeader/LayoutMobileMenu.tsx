import { IDSMobileMenu } from '@inera/ids-react'
import { useInRouterContext } from 'react-router-dom'
import { MobileMenuItem } from '../../../header'
import { getNavigation, getNavigationItemUrl } from '../navigation'

export function LayoutMobileMenu({ mode, activeLink }: { mode: string; activeLink?: string }) {
  const inRouterContext = useInRouterContext()

  if (!inRouterContext) {
    return null
  }

  return (
    <IDSMobileMenu>
      {getNavigation().map((item) => (
        <MobileMenuItem key={item.id} to={getNavigationItemUrl(item, mode)} title={item.name} active={activeLink === item.name} />
      ))}
    </IDSMobileMenu>
  )
}
