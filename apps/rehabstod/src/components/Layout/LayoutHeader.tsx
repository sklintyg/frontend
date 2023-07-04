import {
  IDSHeader,
  IDSHeaderAvatar,
  IDSHeaderItem,
  IDSHeaderNav,
  IDSIconCog,
  IDSIconQuestion,
  IDSIconSwap,
  IDSIconUser,
  IDSLink,
} from '@frontend/ids-react-ts'
import { IDSHeaderAvatarElement } from '@frontend/ids-react-ts/src'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useGetUserQuery } from '../../store/api'
import { useAppDispatch } from '../../store/hooks'
import { showSettingsDialog } from '../../store/slices/settings.slice'
import { HeaderAvatarMenuButton } from './HeaderAvatarMenuButton'
import { LayoutHeaderTab } from './LayoutHeaderTab'
import { LayoutMobileHeader } from './LayoutMobileHeader'
import { isUserDoctor } from '../../utils/isUserDoctor'

export function LayoutHeader() {
  const dispatch = useAppDispatch()
  const { isLoading, data: user } = useGetUserQuery()
  const { logout } = useLogout()
  const sithsUrl = '/saml/login/alias/siths-rs2'
  const avatarRef = useRef<IDSHeaderAvatarElement>(null)

  return (
    <IDSHeader type="inera-admin" className="z-40 bg-white print:hidden">
      <Link className="text-primary-40" slot="brand-text" to="/">
        Rehabstöd
      </Link>

      {!isLoading && user && (
        <>
          <IDSHeaderItem type="inera-admin" mobile>
            <IDSIconQuestion />
            <Link to="/">Om Rehabstöd</Link>
          </IDSHeaderItem>
          <IDSHeaderAvatar
            type="inera-admin"
            username={`${user.namn}${user && isUserDoctor(user) ? ` - Läkare` : ''}`}
            unit={user.valdVardenhet?.namn}
            ref={avatarRef}
          >
            <div slot="dropdown">
              <IDSLink color="var(--IDS-COLOR-PRIMARY-40)" block className="ids-mb-5 ids-mt-2 ">
                <IDSIconSwap height="20" width="20" />
                <Link to="/enhet" onClick={() => avatarRef.current?.tooggleExpand()}>
                  Byt vårdenhet
                </Link>
              </IDSLink>
              <HeaderAvatarMenuButton
                onClick={() => {
                  avatarRef.current?.tooggleExpand()
                  dispatch(showSettingsDialog())
                }}
                label="Inställningar"
                icon={<IDSIconCog color="currentColor" color2="currentColor" height="20" width="20" />}
              />
              <hr className="border-neutral-40 mb-5" />
              <HeaderAvatarMenuButton
                label="Logga ut"
                icon={<IDSIconUser color="currentColor" color2="currentColor" height="20" width="20" />}
                onClick={logout}
              />
            </div>
          </IDSHeaderAvatar>
          <IDSHeaderNav type="inera-admin">
            <LayoutHeaderTab title="Översikt" to="/" />
            <LayoutHeaderTab title="Pågående sjukfall" to="/pagaende-sjukfall" />
            <LayoutHeaderTab title="Läkarutlåtanden" to="/lakarutlatanden" />
          </IDSHeaderNav>
        </>
      )}

      <LayoutMobileHeader />

      {!isLoading && !user && (
        <IDSHeaderItem type="inera-admin" separator-left>
          <IDSIconUser />
          <a href={sithsUrl}>Logga in</a>
        </IDSHeaderItem>
      )}
    </IDSHeader>
  )
}
