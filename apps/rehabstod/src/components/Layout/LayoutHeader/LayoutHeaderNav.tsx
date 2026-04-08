import { IDSHeader1177AdminAvatarMobile, IDSHeader1177AdminNav, IDSLink } from '@inera/ids-react'
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
        <IDSLink block menu>
          <Link to="/enhet">
            <span aria-hidden="true" className="ids-icon-swap-horizontal-small ids-icon--text-start" />
            Byt vårdenhet
          </Link>
        </IDSLink>
        <IDSLink block menu>
          <button type="button" onClick={() => dispatch(updateShowSettingsDialog(true))}>
            <span aria-hidden="true" className="ids-icon-settings ids-icon--text-start" />
            Inställningar
          </button>
        </IDSLink>
        <hr />
        <IDSLink block menu>
          <button type="button" onClick={logout} data-testid="mobile-logout">
            <span aria-hidden="true" className="ids-icon-user ids-icon--text-start" />
            Logga ut
          </button>
        </IDSLink>
      </IDSHeader1177AdminAvatarMobile>
    </IDSHeader1177AdminNav>
  )
}
