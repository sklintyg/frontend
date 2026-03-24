import { IDSMobileMenu, IDSMobileMenuItem } from '@inera/ids-react'
import { Link } from 'react-router-dom'
import { useGetConfigQuery, useGetUserQuery } from '../../../../store/api'
import { useAppDispatch } from '../../../../store/hooks'
import { updateShowSettingsDialog } from '../../../../store/slices/settings.slice'
import { MobileMenuItem } from './MobileMenuItem'

export function LayoutMobileMenu() {
  const { data: user, isLoading } = useGetUserQuery()
  const { data: config } = useGetConfigQuery()
  const dispatch = useAppDispatch()

  if (!user && !isLoading) {
    return (
      <IDSMobileMenu>
        <IDSMobileMenuItem link={<a href={config?.sithsIdpUrl}>Logga in</a>} />
      </IDSMobileMenu>
    )
  }

  if (!user) {
    return null
  }

  return (
    <IDSMobileMenu>
      <MobileMenuItem to="/" title="Översikt" />
      <MobileMenuItem to="/pagaende-sjukfall" title="Pågående sjukfall" />
      <MobileMenuItem to="/lakarutlatanden" title="Läkarutlåtanden" />
      <IDSMobileMenuItem
        link={
          <Link to="/enhet">
            <span aria-hidden="true" className="ids-icon-swap-horizontal-small ids-mobile-menu-item--start-icon" />
            Byt vårdenhet
          </Link>
        }
        secondary
      />
      <IDSMobileMenuItem
        link={
          <button type="button" onClick={() => dispatch(updateShowSettingsDialog(true))}>
            <span aria-hidden="true" className="ids-icon-settings ids-mobile-menu-item--start-icon" />
            Inställningar
          </button>
        }
        secondary
      />
    </IDSMobileMenu>
  )
}
