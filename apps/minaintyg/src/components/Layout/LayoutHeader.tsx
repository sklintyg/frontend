import { HeaderNavItem, MobileMenuItem } from '@frontend/components'
import { IDSHeader, IDSHeaderAvatar, IDSHeaderMobileMenu, IDSHeaderNav } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'

const links = [
  { title: 'Start', path: '/' },
  { title: 'Inkorg', path: '/inkorg' },
  { title: 'Bokade tider', path: '/bokade-tider' },
  { title: 'Bokade tider', path: '/bokade-tider' },
  { title: 'Journalen', path: '/journalen' },
  { title: 'Egen provhantering', path: '/egen-provhantering' },
  { title: 'Stöd och behandling', path: '/stod-och-behandling' },
  { title: 'Intyg', path: '/intyg' },
  { title: 'Övriga tjänster', path: '/ovriga-tjanster' },
]

export function LayoutHeader() {
  return (
    <IDSHeader type="1177" hideregionpicker className="z-40 bg-white print:hidden">
      <IDSHeaderAvatar username="Firstname Lastname">
        <Link to="/installningar" slot="avatar-left">
          Inställningar
        </Link>
        <Link to="/logout" slot="avatar-right">
          Logga ut
        </Link>
      </IDSHeaderAvatar>
      <IDSHeaderNav>
        {links.map(({ title, path }) => (
          <HeaderNavItem key={path} to={path} title={title} />
        ))}
        <IDSHeaderMobileMenu type="1177">
          Meny
          {links.map(({ title, path }) => (
            <MobileMenuItem key={path} to={path} title={title} />
          ))}
        </IDSHeaderMobileMenu>
      </IDSHeaderNav>
    </IDSHeader>
  )
}
