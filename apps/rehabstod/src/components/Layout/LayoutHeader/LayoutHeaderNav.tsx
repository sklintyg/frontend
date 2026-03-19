import { IDSHeader1177AdminNav } from '@inera/ids-react'
import { HeaderNavItem } from './NavItem/HeaderNavItem'

export function LayoutHeaderNav() {
  return (
    <IDSHeader1177AdminNav>
      <HeaderNavItem title="Översikt" to="/" />
      <HeaderNavItem title="Pågående sjukfall" to="/pagaende-sjukfall" />
      <HeaderNavItem title="Läkarutlåtanden" to="/lakarutlatanden" />
    </IDSHeader1177AdminNav>
  )
}
