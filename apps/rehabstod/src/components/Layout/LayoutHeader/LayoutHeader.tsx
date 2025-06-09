import type { IDSHeader1177AdminAvatar as IDSHeader1177AdminAvatarElement } from '@inera/ids-core/components/header-1177-admin/header-1177-admin-avatar-element.js'
import {
  IDSHeader1177Admin,
  IDSHeader1177AdminAvatar,
  IDSHeader1177AdminItem,
  IDSHeader1177AdminNav,
  IDSIconCog,
  IDSIconSwap,
  IDSIconUser,
  IDSLink,
} from '@inera/ids-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../../../hooks/useLogout'
import { useGetConfigQuery, useGetUserQuery } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowSettingsDialog } from '../../../store/slices/settings.slice'
import { isUserDoctor } from '../../../utils/isUserDoctor'
import { AboutHeaderItem } from './AboutHeaderItem'
import { HeaderAvatarMenuButton } from './HeaderAvatarMenuButton'
import { LayoutMobileHeader } from './LayoutMobileHeader'
import { HeaderNavItem } from './NavItem/HeaderNavItem copy'

export function LayoutHeader() {
  const dispatch = useAppDispatch()
  const { isLoading, data: user } = useGetUserQuery()
  const { logout } = useLogout()
  const { data: config } = useGetConfigQuery()
  const avatarRef = useRef<IDSHeader1177AdminAvatarElement>(null)

  return (
    <IDSHeader1177Admin className="z-40 bg-white print:hidden">
      <IDSLink slot="skip-to-content" className="z-40">
        <a href="#content">Till sidans huvudinnehåll</a>
      </IDSLink>

      <Link className="text-primary-40" slot="brand-text" to="/">
        Rehabstöd
      </Link>

      {!isLoading && user && (
        <>
          <AboutHeaderItem />
          <IDSHeader1177AdminAvatar
            username={`${user.namn}${user && isUserDoctor(user) ? ` - Läkare` : ''}`}
            unit={user.valdVardenhet?.namn}
            ref={avatarRef}
          >
            <div slot="dropdown">
              <IDSLink colorpreset={2} block className="ids-mb-5 ids-mt-2 ">
                <IDSIconSwap height="20" width="20" />
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
                icon={<IDSIconCog color="currentColor" color2="currentColor" height="20" width="20" />}
                testid="settings-button"
              />
              <hr className="mb-5 border-neutral-40" />
              <HeaderAvatarMenuButton
                label="Logga ut"
                icon={<IDSIconUser color="currentColor" color2="currentColor" height="20" width="20" />}
                onClick={logout}
                testid="logout-button"
              />
            </div>
          </IDSHeader1177AdminAvatar>
          <IDSHeader1177AdminNav>
            <HeaderNavItem title="Översikt" to="/" />
            <HeaderNavItem title="Pågående sjukfall" to="/pagaende-sjukfall" />
            <HeaderNavItem title="Läkarutlåtanden" to="/lakarutlatanden" />
          </IDSHeader1177AdminNav>
        </>
      )}

      <LayoutMobileHeader />

      {!isLoading && !user && (
        <IDSHeader1177AdminItem separator-left>
          <IDSIconUser />
          <a href={config && config.sithsIdpUrl}>Logga in</a>
        </IDSHeader1177AdminItem>
      )}
    </IDSHeader1177Admin>
  )
}
