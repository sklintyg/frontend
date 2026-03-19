import { IDSHeader1177AdminAvatarMobile, IDSHeader1177AdminMenuMobile } from '@inera/ids-react'
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
      <IDSHeader1177AdminMenuMobile>
        <nav className="ids-mobile-menu">
          <ul>
            <li className="ids-mobile-menu-item">
              <div className="ids-mobile-menu-item__inner">
                <a href={config?.sithsIdpUrl}>Logga in</a>
              </div>
            </li>
          </ul>
        </nav>
      </IDSHeader1177AdminMenuMobile>
    )
  }

  if (!user) {
    return null
  }

  return (
    <IDSHeader1177AdminMenuMobile>
      <nav className="ids-mobile-menu">
        <ul>
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
        </ul>
      </nav>

      {!isLoading && user && (
        <IDSHeader1177AdminAvatarMobile username={name} unit={unit}>
          <button type="button" className="ids-link" onClick={logout} data-testid="mobile-logout">
            Logga ut
          </button>
        </IDSHeader1177AdminAvatarMobile>
      )}
    </IDSHeader1177AdminMenuMobile>
  )
}
