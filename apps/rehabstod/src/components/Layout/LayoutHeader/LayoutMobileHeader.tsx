/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { MobileMenuItem } from '@frontend/components'
import { IDSHeaderMobileMenu, IDSMobileMenuItem } from '@frontend/ids-react-ts'
import { useLogout } from '../../../hooks/useLogout'
import { useGetUserQuery } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowSettingsDialog } from '../../../store/slices/settings.slice'

export function LayoutMobileHeader() {
  const { data: user } = useGetUserQuery()
  const dispatch = useAppDispatch()
  const { logout } = useLogout()

  return (
    <IDSHeaderMobileMenu type="inera-admin">
      <IDSMobileMenuItem headline={user?.namn}>
        <MobileMenuItem to="/enhet" title="Byt vårdenhet" />
        <IDSMobileMenuItem>
          <a
            onClick={() => {
              dispatch(updateShowSettingsDialog(true))
            }}
          >
            Inställningar
          </a>
        </IDSMobileMenuItem>
        <IDSMobileMenuItem>
          <a onClick={logout}>Logga ut</a>
        </IDSMobileMenuItem>
      </IDSMobileMenuItem>
      <MobileMenuItem to="/" title='Översikt' />
      <MobileMenuItem to="/pagaende-sjukfall" title="Pågående sjukfall" />
      <MobileMenuItem to="/lakarutlatanden" title="Läkarutlåtanden" />
    </IDSHeaderMobileMenu>
  )
}
