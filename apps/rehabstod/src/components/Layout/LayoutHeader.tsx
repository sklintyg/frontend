import { IDSHeader, IDSHeaderAvatar, IDSHeaderItem, IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useGetUserQuery } from '../../store/api'

export function LayoutHeader() {
  const { isLoading, data: user } = useGetUserQuery()
  const { logout } = useLogout()

  return (
    <IDSHeader type="inera-admin" unresponsive>
      <Link className="text-primary-40" slot="brand-text" to="/">
        Rehabstöd
      </Link>

      {!isLoading && user && (
        <>
          <IDSHeaderItem type="inera-admin" icon="question">
            <Link to="/">Om rehabstöd</Link>
          </IDSHeaderItem>
          <IDSHeaderAvatar type="inera-admin" username={user.namn}>
            <span slot="avatar-text">{user.valdVardenhet?.namn}</span>
            <div slot="dropdown">
              <IDSLink color="var(--IDS-COLOR-PRIMARY-40)" block className="ids-mb-5 ids-mt-2 ">
                <IDSIcon height="20" width="20" name="swap" />
                <Link to="/">Byt vårdenhet</Link>
              </IDSLink>
              <IDSLink color="var(--IDS-COLOR-PRIMARY-40)" block className="ids-mb-5 text-primary-40">
                <IDSIcon height="20" width="20" name="cog" />
                <Link to="/settings">Inställningar</Link>
              </IDSLink>
              <hr className="border-neutral-40" />
              <button onClick={logout} className="ids-mt-5 text-primary-40 flex w-full items-center" type="submit">
                <div className="mr-2.5">
                  <IDSIcon color="currentColor" color2="currentColor" height="20" width="20" name="user" />
                </div>
                <div className="flex-auto text-left">Logga ut</div>
              </button>
            </div>
          </IDSHeaderAvatar>
        </>
      )}

      {!isLoading && !user && (
        <IDSHeaderItem type="inera-admin" separator-left icon="user">
          <Link to="login">Logga in</Link>
        </IDSHeaderItem>
      )}
    </IDSHeader>
  )
}
