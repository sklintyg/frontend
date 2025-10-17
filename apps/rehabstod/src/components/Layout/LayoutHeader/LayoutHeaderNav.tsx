import { HeaderNavItem } from './NavItem/HeaderNavItem'

export function LayoutHeaderNav() {
  return (
    <nav className="ids-header-1177-admin__nav">
      <ul className="ids-header-1177-admin__nav-inner">
        <HeaderNavItem title="Översikt" to="/" />
        <HeaderNavItem title="Pågående sjukfall" to="/pagaende-sjukfall" />
        <HeaderNavItem title="Läkarutlåtanden" to="/lakarutlatanden" />
      </ul>
    </nav>
  )
}
