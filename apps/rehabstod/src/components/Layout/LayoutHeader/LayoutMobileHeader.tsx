/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { MobileMenuItem } from '@frontend/components'
import { IDSHeaderMobileMenu, IDSIconArrow, IDSIconCog, IDSIconUser, IDSLink, IDSMobileMenuAvatar } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useLogout } from '../../../hooks/useLogout'
import { useGetUserQuery } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowSettingsDialog } from '../../../store/slices/settings.slice'

export function LayoutMobileHeader() {
  const { data: user } = useGetUserQuery()
  const dispatch = useAppDispatch()
  const { logout } = useLogout()

  if (!user) {
    return null
  }

  return (
    <IDSHeaderMobileMenu type="inera-admin">
      <MobileMenuItem to="/" title="Översikt" />
      <MobileMenuItem to="/pagaende-sjukfall" title="Pågående sjukfall" />
      <MobileMenuItem to="/lakarutlatanden" title="Läkarutlåtanden" />
      <IDSMobileMenuAvatar username={user.namn} unit={user.valdVardenhet?.namn}>
        <IDSLink block className="mb-5 mt-2" color="var(--IDS-COLOR-PRIMARY-40)">
          <IDSIconArrow height="25" width="25" />
          <Link to="/enhet">Byt vårdenhet</Link>
        </IDSLink>
        <IDSLink block className="mb-5" color="var(--IDS-COLOR-PRIMARY-40)">
          <IDSIconCog height="25" width="25" />
          <a
            onClick={() => {
              dispatch(updateShowSettingsDialog(true))
            }}
          >
            Inställningar
          </a>
        </IDSLink>
        <hr />
        <IDSLink block className="mt-5" color="var(--IDS-COLOR-PRIMARY-40)">
          <IDSIconUser height="25" width="25" />
          <a onClick={logout} data-testid="mobile-logout">
            Logga ut
          </a>
        </IDSLink>
      </IDSMobileMenuAvatar>
    </IDSHeaderMobileMenu>
  )
}
