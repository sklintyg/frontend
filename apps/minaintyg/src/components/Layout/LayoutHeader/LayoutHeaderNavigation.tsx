/* eslint-disable jsx-a11y/anchor-is-valid */
import { HeaderNavItem, MobileMenuItem } from '@frontend/components'
import { IDSHeaderMobileItem, IDSHeaderMobileMenu, IDSHeaderNav } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useLogout } from '../../../hooks/useLogout'

const links = [
  { title: 'Start', path: '/' },
  { title: 'Inkorg', path: '/inkorg' },
  { title: 'Bokade tider', path: '/bokade-tider' },
  { title: 'Journalen', path: '/journalen' },
  { title: 'Egen provhantering', path: '/egen-provhantering' },
  { title: 'Stöd och behandling', path: '/stod-och-behandling' },
  { title: 'Intyg', path: '/intyg' },
  { title: 'Övriga tjänster', path: '/ovriga-tjanster' },
]

export function LayoutHeaderNavigation() {
  const logout = useLogout()

  return (
    <IDSHeaderNav>
      {links.map(({ title, path }) => (
        <HeaderNavItem key={path} to={path} title={title} />
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
        {links.map(({ title, path }) => (
          <MobileMenuItem key={path} to={path} title={title} />
        ))}
      </IDSHeaderMobileMenu>
    </IDSHeaderNav>
  )
}
