import type { IDSHeader1177AdminAvatar as IDSHeader1177AdminAvatarElement } from '@inera/ids-core/components/header-1177-admin/header-1177-admin-avatar-element.js'
import { IDSHeader1177Admin, IDSHeader1177AdminAvatar, IDSHeader1177AdminItem, IDSHeader1177AdminNav, IDSLink } from '@inera/ids-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../../../hooks/useLogout'
import { useGetConfigQuery, useGetUserQuery } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowSettingsDialog } from '../../../store/slices/settings.slice'
import { isUserDoctor } from '../../../utils/isUserDoctor'
import { AboutHeaderItem } from './AboutHeaderItem'
import { HeaderAvatarMenuButton } from './HeaderAvatarMenuButton'
import { HeaderNavItem } from './NavItem/HeaderNavItem'

export function LayoutHeader() {
  const dispatch = useAppDispatch()
  const { isLoading, data: user } = useGetUserQuery()
  const { logout } = useLogout()
  const { data: config } = useGetConfigQuery()
  const avatarRef = useRef<IDSHeader1177AdminAvatarElement>(null)

  return (
    <IDSHeader1177Admin className="z-40 bg-white print:hidden" brandtext="Rehabstöd">
      <a href="#content" slot="skip-to-content" className="text-accent-40">
        Till sidans huvudinnehåll
      </a>

      {!isLoading && user && (
        <>
          <AboutHeaderItem />
          <IDSHeader1177AdminAvatar
            username={`${user.namn}${user && isUserDoctor(user) ? ` - Läkare` : ''}`}
            unit={user.valdVardenhet?.namn}
            ref={avatarRef}
          >
            <IDSLink block large starticon="question">
              <Link to="/enhet" onClick={() => avatarRef.current?.toggleExpanded()}>
                Byt vårdenhet
              </Link>
            </IDSLink>
            <HeaderAvatarMenuButton
              onClick={() => {
                avatarRef.current?.toggleExpanded()
                dispatch(updateShowSettingsDialog(true))
              }}
              label="Inställningar"
              icon="settings"
              testid="settings-button"
            />
            <hr />
            <HeaderAvatarMenuButton label="Logga ut" icon="user" onClick={logout} testid="logout-button" />
          </IDSHeader1177AdminAvatar>
          <IDSHeader1177AdminNav>
            <HeaderNavItem title="Översikt" to="/" />
            <HeaderNavItem title="Pågående sjukfall" to="/pagaende-sjukfall" />
            <HeaderNavItem title="Läkarutlåtanden" to="/lakarutlatanden" />
          </IDSHeader1177AdminNav>
        </>
      )}

      {/* <LayoutMobileHeader /> */}

      {!isLoading && !user && (
        <IDSHeader1177AdminItem>
          <span className="ids-icon-user" slot="icon" />
          <a href={config && config.sithsIdpUrl}>Logga in</a>
        </IDSHeader1177AdminItem>
      )}
    </IDSHeader1177Admin>
  )
}
