import { IDSDialog, IDSHeader, IDSHeaderAvatar, IDSHeaderItem, IDSHeaderNav, IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useLogout } from '../../hooks/useLogout'
import { useGetUserQuery } from '../../store/api'
import { LayoutHeaderTab } from './LayoutHeaderTab'
import { SettingsDialogContent } from '../SettingsDialogContent/SettingsDialogContent'

export function LayoutHeader() {
  const { isLoading, data: user } = useGetUserQuery()
  const { logout } = useLogout()
  const sithsUrl = '/saml/login/alias/siths-rs2'
  const [showSettingsDialog, setShowSettingsDialog] = useState('false')

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
          <IDSHeaderAvatar type="inera-admin" username={user.namn} unit={user.valdVardenhet?.namn}>
            <div slot="dropdown">
              <IDSLink color="var(--IDS-COLOR-PRIMARY-40)" block className="ids-mb-5 ids-mt-2 ">
                <IDSIcon height="20" width="20" name="swap" />
                <Link to="/enhet">Byt vårdenhet</Link>
              </IDSLink>
              <IDSDialog dismissible headline="Inställningar" show={showSettingsDialog}>
                <IDSLink trigger="" color="var(--IDS-COLOR-PRIMARY-40)" block className="ids-mb-5 text-primary-40">
                  <IDSIcon height="20" width="20" name="cog" />
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                  <a onClick={() => setShowSettingsDialog('true')}>Inställningar</a>
                </IDSLink>
                <SettingsDialogContent onClose={() => setShowSettingsDialog('false')} preferences={user ? user.preferences : undefined} />
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
