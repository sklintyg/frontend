/* eslint-disable jsx-a11y/anchor-is-valid */
import { HeaderNavItem, MobileMenuItem } from '@frontend/components'
import { IDSHeaderMobileItem, IDSHeaderMobileMenu, IDSHeaderNav } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { resolveNavigationUrl } from '../../../utils/resolveNavigationUrl'
import navigation from './data/1177-navbar-services.json'
import settingsUrl from './data/settings-url.json'

export function LayoutHeaderNavigation() {
  return (
    <IDSHeaderNav>
      {navigation.menu.items.map(({ id, name, url }) => (
        <HeaderNavItem key={id} to={resolveNavigationUrl(url)} title={name} />
      ))}

      <IDSHeaderMobileItem>
        <Link to={resolveNavigationUrl(settingsUrl)}>Inställningar</Link>
      </IDSHeaderMobileItem>
      <IDSHeaderMobileItem>
        <Link to="/logout" slot="avatar-right">
          Logga ut
        </Link>
      </IDSHeaderMobileItem>

      <IDSHeaderMobileMenu type="1177">
        Meny
        {navigation.menu.items.map(({ id, name, url }) => (
          <MobileMenuItem key={id} to={resolveNavigationUrl(url)} title={name} />
        ))}
      </IDSHeaderMobileMenu>
    </IDSHeaderNav>
  )
}
