import { IDSHeaderMobileItem, IDSHeaderMobileMenu, IDSHeaderNav } from 'ids-react-ts'
import { Link, useInRouterContext } from 'react-router-dom'
import { HeaderNavItem, MobileMenuItem } from '../../../header'
import { getNavigation, getNavigationItemUrl, getSettingsUrl } from '../navigation'

export function LayoutHeaderNavigation({ mode, activeLink }: { mode: string; activeLink?: string }) {
  const inRouterContext = useInRouterContext()

  if (!inRouterContext) {
    return null
  }

  return (
    <IDSHeaderNav>
      {getNavigation().map((item) => (
        <HeaderNavItem key={item.id} to={getNavigationItemUrl(item, mode)} title={item.name} active={activeLink === item.name} />
      ))}

      <IDSHeaderMobileItem>
        <Link to={getSettingsUrl(mode)}>Inställningar</Link>
      </IDSHeaderMobileItem>
      <IDSHeaderMobileItem>
        <Link to="/logga-ut" slot="avatar-right">
          Logga ut
        </Link>
      </IDSHeaderMobileItem>

      <IDSHeaderMobileMenu type="1177">
        Meny
        {getNavigation().map((item) => (
          <MobileMenuItem key={item.id} to={getNavigationItemUrl(item, mode)} title={item.name} active={activeLink === item.name} />
        ))}
      </IDSHeaderMobileMenu>
    </IDSHeaderNav>
  )
}
