import { IDSDialog, IDSHeader, IDSHeaderAvatar, IDSHeaderItem, IDSHeaderNav, IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { IDSDialogElement, IDSHeaderAvatarElement } from '@frontend/ids-react-ts/src'
import { useLogout } from '../../hooks/useLogout'
import { useGetUserQuery } from '../../store/api'
import { LayoutHeaderTab } from './LayoutHeaderTab'
import { SettingsDialogContent } from '../SettingsDialogContent/SettingsDialogContent'

export function LayoutHeader() {
  const { isLoading, data: user } = useGetUserQuery()
  const { logout } = useLogout()
  const sithsUrl = '/saml/login/alias/siths-rs2'
  const ref = useRef<IDSDialogElement>(null)
  const refHeaderAvatar = useRef<IDSHeaderAvatarElement>(null)

  return (
    <IDSHeader type="inera-admin" unresponsive>
      <Link className="text-primary-40" slot="brand-text" to="/">
        Rehabstöd
      </Link>

      {!isLoading && user && (
        <>
          <IDSHeaderItem type="inera-admin" icon="question">
            <Link to="/">Om Rehabstöd</Link>
          </IDSHeaderItem>
          <IDSHeaderAvatar type="inera-admin" username={user.namn} unit={user.valdVardenhet?.namn} ref={refHeaderAvatar}>
            <div slot="dropdown">
              <IDSLink color="var(--IDS-COLOR-PRIMARY-40)" block className="ids-mb-5 ids-mt-2 ">
                <IDSIcon height="20" width="20" name="swap" />
                <Link to="/enhet" onClick={() => refHeaderAvatar.current?.tooggleExpand()}>
                  Byt vårdenhet
                </Link>
              </IDSLink>
              <IDSDialog dismissible headline="Inställningar" ref={ref}>
                <button
                  trigger=""
                  onClick={() => {
                    refHeaderAvatar.current?.tooggleExpand()
                    ref.current?.showDialog()
                  }}
                  className="ids-my-5 text-primary-40 flex w-full items-center"
                  type="submit">
                  <div className="mr-2.5">
                    <IDSIcon color="currentColor" color2="currentColor" height="20" width="20" name="cog" />
                  </div>
                  <div className="flex-auto text-left">Inställningar</div>
                </button>
                <SettingsDialogContent onClose={() => ref.current?.hideDialog()} preferences={user ? user.preferences : undefined} />
              </IDSDialog>
              <hr className="border-neutral-40" />
              <button onClick={logout} className="ids-mt-5 text-primary-40 flex w-full items-center" type="submit">
                <div className="mr-2.5">
                  <IDSIcon color="currentColor" color2="currentColor" height="20" width="20" name="user" />
                </div>
                <div className="flex-auto text-left">Logga ut</div>
              </button>
            </div>
          </IDSHeaderAvatar>
          <IDSHeaderNav type="inera-admin">
            <LayoutHeaderTab title="Översikt" to="/" />
            <LayoutHeaderTab title="Pågående sjukfall" to="/pagaende-sjukfall" />
            <LayoutHeaderTab title="Läkarutlåtanden" to="/lakarutlatanden" />
          </IDSHeaderNav>
        </>
      )}

      {!isLoading && !user && (
        <IDSHeaderItem type="inera-admin" separator-left icon="user">
          <a href={sithsUrl}>Logga in</a>
        </IDSHeaderItem>
      )}
    </IDSHeader>
  )
}
