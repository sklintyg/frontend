import { IDSHeader1177AdminAvatarMobile, IDSHeader1177AdminNav } from '@inera/ids-react'
import { Link } from 'react-router-dom'
import { useLogout } from '../../../hooks/useLogout'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowSettingsDialog } from '../../../store/slices/settings.slice'
import { HeaderNavItem } from './NavItem/HeaderNavItem'

export function LayoutHeaderNav({ name, unit }: { name: string; unit: string }) {
  const { logout } = useLogout()
  const dispatch = useAppDispatch()

  return (
    <IDSHeader1177AdminNav>
      <HeaderNavItem title="Översikt" to="/" />
      <HeaderNavItem title="Pågående sjukfall" to="/pagaende-sjukfall" />
      <HeaderNavItem title="Läkarutlåtanden" to="/lakarutlatanden" />
      <IDSHeader1177AdminAvatarMobile username={name} unit={unit}>
        <Link to="/enhet" className="ids-link ids-link--icon ids-link--large ids-link--block">
          Byt vårdenhet
        </Link>
        <button type="button" className="ids-link ids-link--icon ids-link--block" onClick={() => dispatch(updateShowSettingsDialog(true))}>
          Inställningar
        </button>
        <hr />
        <button type="button" className="ids-link ids-link--icon ids-link--block" onClick={logout} data-testid="mobile-logout">
          Logga ut
        </button>
      </IDSHeader1177AdminAvatarMobile>
    </IDSHeader1177AdminNav>
  )
}
