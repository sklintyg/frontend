/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { MobileMenuItem } from '@frontend/components'
import { IDSHeaderMobileMenu, IDSIconCog, IDSIconSwap, IDSIconUser, IDSLink, IDSMobileMenuAvatar } from '@frontend/ids-react-ts'
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
        <IDSLink block className="mb-5 mt-2" colorpreset={2}>
          <IDSIconSwap height="20" width="20" color="currentColor" />
          <Link to="/enhet">Byt vårdenhet</Link>
        </IDSLink>
        <IDSLink block className="mb-5" colorpreset={2}>
          <IDSIconCog height="25" width="25" />
          <a
            onClick={() => {
              dispatch(updateShowSettingsDialog(true))
            }}
          >
            Inställningar
          </a>
        </IDSLink>
        <hr className="ids-divider" />
        <IDSLink block className="mt-5" colorpreset={2}>
          <IDSIconUser height="25" width="25" />
          <a onClick={logout} data-testid="mobile-logout">
            Logga ut
          </a>
        </IDSLink>
      </IDSMobileMenuAvatar>
    </IDSHeaderMobileMenu>
  )
}
