import { HeaderNavItem } from '@frontend/components'
import type { IDSHeaderAvatarElement } from '@frontend/ids-react-ts'
import {
  IDSHeader,
  IDSHeaderAvatar,
  IDSHeaderItem,
  IDSHeaderNav,
  IDSIconCog,
  IDSIconSwap,
  IDSIconUser,
  IDSLink,
} from '@frontend/ids-react-ts'
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

export function LayoutHeader() {
  const dispatch = useAppDispatch()
  const { isLoading, data: user } = useGetUserQuery()
  const { logout } = useLogout()
  const { data: config } = useGetConfigQuery()
  const avatarRef = useRef<IDSHeaderAvatarElement>(null)

  return (
    <IDSHeader type="inera-admin" className="z-40 bg-white print:hidden">
      <IDSLink slot="skip-to-content" className="z-40">
        <a href="#content">Till sidans huvudinnehåll</a>
      </IDSLink>

      <Link className="text-primary-40" slot="brand-text" to="/">
        Rehabstöd
      </Link>

      {!isLoading && user && (
        <>
          <AboutHeaderItem />
          <IDSHeaderAvatar
            type="inera-admin"
            username={`${user.namn}${user && isUserDoctor(user) ? ` - Läkare` : ''}`}
            unit={user.valdVardenhet?.namn}
            ref={avatarRef}
          >
            <div slot="dropdown">
              <IDSLink colorpreset={2} block className="ids-mb-5 ids-mt-2 ">
                <IDSIconSwap height="20" width="20" />
                <Link to="/enhet" onClick={() => avatarRef.current?.tooggleExpand()}>
                  Byt vårdenhet
                </Link>
              </IDSLink>
              <HeaderAvatarMenuButton
                onClick={() => {
                  avatarRef.current?.tooggleExpand()
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
          </IDSHeaderAvatar>
          <IDSHeaderNav type="inera-admin">
            <HeaderNavItem title="Översikt" to="/" />
            <HeaderNavItem title="Pågående sjukfall" to="/pagaende-sjukfall" />
            <HeaderNavItem title="Läkarutlåtanden" to="/lakarutlatanden" />
          </IDSHeaderNav>
        </>
      )}

      <LayoutMobileHeader />

      {!isLoading && !user && (
        <IDSHeaderItem type="inera-admin" separator-left>
          <IDSIconUser />
          <a href={config && config.sithsIdpUrl}>Logga in</a>
        </IDSHeaderItem>
      )}
    </IDSHeader>
  )
}
