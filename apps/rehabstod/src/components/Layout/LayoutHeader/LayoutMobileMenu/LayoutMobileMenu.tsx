import '@inera/ids-design/components/mobile-menu/mobile-menu.css'
import { IDSIconCog, IDSIconSwap } from '@inera/ids-react'
import { Link } from 'react-router-dom'
import { useLogout } from '../../../../hooks/useLogout'
import { useGetConfigQuery, useGetUserQuery } from '../../../../store/api'
import { useAppDispatch } from '../../../../store/hooks'
import { updateShowSettingsDialog } from '../../../../store/slices/settings.slice'
import { MobileMenuItem } from './MobileMenuItem'

export function LayoutMobileMenu({ name, unit }: { name: string; unit: string }) {
  const { data: user, isLoading } = useGetUserQuery()
  const { data: config } = useGetConfigQuery()
  const dispatch = useAppDispatch()
  const { logout } = useLogout()

  if (!user && !isLoading) {
    return (
      <div className="ids-header-1177-admin__nav-mobile__menu-items">
        <nav className="ids-mobile-menu">
          <ul>
            <li className="ids-header-1177-admin__avatar-mobile">
              <a className="ids-header-1177-admin__avatar-mobile__login-link" href={config && config.sithsIdpUrl}>
                Logga in
              </a>
            </li>
          </ul>
        </nav>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="ids-header-1177-admin__nav-mobile__menu-items">
      <nav className="ids-mobile-menu">
        <ul>
          <MobileMenuItem to="/" title="Översikt" />
          <MobileMenuItem to="/pagaende-sjukfall" title="Pågående sjukfall" />
          <MobileMenuItem to="/lakarutlatanden" title="Läkarutlåtanden" />

          <li className="ids-mobile-menu-item">
            <div className="ids-mobile-menu-item__inner font-normal">
              <IDSIconSwap />
              <span className="ids-icon-swap-horizontal" />
              <Link to="/enhet">Byt vårdenhet</Link>
            </div>
          </li>
          <li className="ids-mobile-menu-item">
            <button type="button" onClick={() => dispatch(updateShowSettingsDialog(true))}>
              <IDSIconCog />
              Inställningar
            </button>
          </li>

          {!isLoading && user && (
            <li className="ids-header-1177-admin__avatar-mobile">
              <div className="ids-header-1177-admin__avatar-mobile__logged-in">
                <div className="ids-header-1177-admin__avatar-mobile__username">{name}</div>
                <div className="ids-header-1177-admin__avatar-mobile__unit">{unit}</div>
              </div>
              <button type="button" className="ids-link" onClick={logout} data-testid="mobile-logout">
                Logga ut
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}
