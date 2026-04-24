import { IDSHeader1177AdminAvatar } from '@inera/ids-react'
import { Icon } from '@frontend/components'
import { Link } from 'react-router-dom'
import { useLogout } from '../../../hooks/useLogout'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowSettingsDialog } from '../../../store/slices/settings.slice'
import { HeaderAvatarMenuButton } from './HeaderAvatarMenuButton'

export function HeaderAvatarMenu({ name, unit }: { name: string; unit: string }) {
  const dispatch = useAppDispatch()
  const { logout } = useLogout()

  return (
    <div className="my-2 [&_.ids-header-1177-admin-avatar__button]:max-w-none">
      <IDSHeader1177AdminAvatar username={name} unit={unit}>
        <Link to="/enhet" className="ids-link ids-link--icon ids-link--large ids-link--block">
          <Icon icon="swap-horizontal" textStart />
          Byt vårdenhet
        </Link>

        <HeaderAvatarMenuButton icon="settings" onClick={() => dispatch(updateShowSettingsDialog(true))}>
          Inställningar
        </HeaderAvatarMenuButton>

        <hr className="border-neutral-200 my-1 border-t" />

        <HeaderAvatarMenuButton icon="user" onClick={logout} data-testid="logout">
          Logga ut
        </HeaderAvatarMenuButton>
      </IDSHeader1177AdminAvatar>
    </div>
  )
}
