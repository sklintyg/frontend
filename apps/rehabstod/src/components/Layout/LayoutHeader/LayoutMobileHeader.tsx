/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { IDSHeader1177AdminAvatarMobile } from '@inera/ids-react'
import { useLogout } from '../../../hooks/useLogout'
import { useGetConfigQuery, useGetUserQuery } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { isUserDoctor } from '../../../utils/isUserDoctor'
import { MobileMenuItem } from './NavItem/MobileMenuItem'

export function LayoutMobileHeader() {
  const { data: user, isLoading } = useGetUserQuery()
  const { data: config } = useGetConfigQuery()
  const dispatch = useAppDispatch()
  const { logout } = useLogout()

  if (!user && !isLoading) {
    return (
      <IDSHeader1177AdminAvatarMobile>
        <a href={config && config.sithsIdpUrl} className="cursor-pointer text-accent-40" slot="login">
          Logga in
        </a>
      </IDSHeader1177AdminAvatarMobile>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <MobileMenuItem to="/" title="Översikt" slot="mobile-item" />
      <MobileMenuItem to="/pagaende-sjukfall" title="Pågående sjukfall" slot="mobile-item" />
      <MobileMenuItem to="/lakarutlatanden" title="Läkarutlåtanden" slot="mobile-item" />

      {/* <IDSHeader1177AdminAvatarMobile username={user.namn} unit={user.valdVardenhet?.namn}>
        <IDSLink block className="mb-5 mt-2" colorpreset={2}>
          <IDSIconSwap height="20" width="20" color="currentColor" />
          <Link to="/enhet">Byt vårdenhet</Link>
        </IDSLink>
        <IDSLink block className="mb-5" colorpreset={2}>
          <IDSIconCog height="25" width="25" />
          <a
            onClick={() => {
              dispatch(updateShowSettingsDialog(true))
            }}
          >
            Inställningar
          </a>
        </IDSLink>
        <hr className="ids-divider" />
        <IDSLink block className="mt-5" colorpreset={2}>
          <IDSIconUser height="25" width="25" />
          <a onClick={logout} data-testid="mobile-logout">
            Logga ut
          </a>
        </IDSLink>
      </IDSHeader1177AdminAvatarMobile> */}

      {/* <IDSHeader1177AdminAvatarMobile>
        <Link to="/enhet">Byt vårdenhet</Link>
      </IDSHeader1177AdminAvatarMobile>
      <IDSHeader1177AdminAvatarMobile>
        <a
          onClick={() => {
            dispatch(updateShowSettingsDialog(true))
          }}
        >
          Inställningar
        </a>
      </IDSHeader1177AdminAvatarMobile> */}

      {user && (
        <IDSHeader1177AdminAvatarMobile
          username={`${user.namn}${user && isUserDoctor(user) ? ` - Läkare` : ''}`}
          unit={user.valdVardenhet?.namn}
        >
          <a onClick={logout} className="cursor-pointer text-accent-40" data-testid="mobile-logout" slot="logout">
            Logga ut
          </a>
        </IDSHeader1177AdminAvatarMobile>
      )}
    </>
  )
}
