/* eslint-disable jsx-a11y/anchor-is-valid */
import { HeaderNavItem, MobileMenuItem } from '@frontend/components'
import { IDSHeaderMobileItem, IDSHeaderMobileMenu, IDSHeaderNav } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useLogout } from '../../../hooks/useLogout'
import navigation from './1177-navbar-services.json'

export function LayoutHeaderNavigation() {
  const logout = useLogout()

  return (
    <IDSHeaderNav>
      {navigation.menu.items.map(({ id, name, url }) => (
        <HeaderNavItem key={id} to={url.prod} title={name} />
      ))}

      <IDSHeaderMobileItem>
        <Link to="/installningar">Inställningar</Link>
      </IDSHeaderMobileItem>
      <IDSHeaderMobileItem>
        <a href="#" onClick={logout}>
          Logga ut
        </a>
      </IDSHeaderMobileItem>

      <IDSHeaderMobileMenu type="1177">
        Meny
        {navigation.menu.items.map(({ id, name, url }) => (
          <MobileMenuItem key={id} to={url.prod} title={name} />
        ))}
      </IDSHeaderMobileMenu>
    </IDSHeaderNav>
  )
}
