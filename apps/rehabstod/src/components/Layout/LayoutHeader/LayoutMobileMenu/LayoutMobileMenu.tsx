import { IDSMobileMenu } from '@inera/ids-react'
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
        <li className="ids-mobile-menu-item">
          <div className="ids-mobile-menu-item__inner">
            <a href={config?.sithsIdpUrl}>Logga in</a>
          </div>
        </li>
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

      <li className="ids-mobile-menu-item flex items-center gap-5 border-b border-accent-40 bg-neutral-100 px-5 py-3 font-normal text-accent-40">
        <span className="ids-icon-swap-horizontal text-2xl" />
        <Link to="/enhet">Byt vårdenhet</Link>
      </li>

      <li className="ids-mobile-menu-item flex items-center gap-5 border-b border-accent-40 bg-neutral-100 px-5 py-3 font-normal text-accent-40">
        <span className="ids-icon-settings text-2xl" />
        <button type="button" onClick={() => dispatch(updateShowSettingsDialog(true))}>
          Inställningar
        </button>
      </li>
    </IDSMobileMenu>
  )
}
