/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { IDSHeaderMobileMenu, IDSMobileMenuItem } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useGetUserQuery } from '../../store/api'
import { useAppDispatch } from '../../store/hooks'
import { showSettingsDialog } from '../../store/slices/settings.slice'

export function LayoutMobileHeader() {
  const { data: user } = useGetUserQuery()
  const dispatch = useAppDispatch()
  const { logout } = useLogout()

  return (
    <IDSHeaderMobileMenu type="inera-admin">
      <IDSMobileMenuItem headline={user?.namn}>
        <IDSMobileMenuItem>
          <Link to="/enhet">Byt vårdenhet</Link>
        </IDSMobileMenuItem>
        <IDSMobileMenuItem>
          <a
            onClick={() => {
              dispatch(showSettingsDialog())
            }}
          >
            Inställningar
          </a>
        </IDSMobileMenuItem>
        <IDSMobileMenuItem>
          <a onClick={logout}>Logga ut</a>
        </IDSMobileMenuItem>
      </IDSMobileMenuItem>
      <IDSMobileMenuItem>
        <Link to="/">Översikt</Link>
      </IDSMobileMenuItem>
      <IDSMobileMenuItem>
        <Link to="/pagaende-sjukfall">Pågående sjukfall</Link>
      </IDSMobileMenuItem>
      <IDSMobileMenuItem>
        <Link to="/lakarutlatanden">Läkarutlåtanden</Link>
      </IDSMobileMenuItem>
    </IDSHeaderMobileMenu>
  )
}
