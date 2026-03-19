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
    <IDSHeader1177AdminAvatar username={name} unit={unit}>
      <Link to="/enhet" className="ids-link ids-link--icon ids-link--large ids-link--block">
        <Icon icon="swap-horizontal" textStart />
        Byt vårdenhet
      </Link>

      <HeaderAvatarMenuButton icon="settings" onClick={() => dispatch(updateShowSettingsDialog(true))}>
        Inställningar
      </HeaderAvatarMenuButton>

      <hr className="border-t border-neutral-200 my-1" />

      <HeaderAvatarMenuButton icon="user" onClick={logout}>
        Logga ut
      </HeaderAvatarMenuButton>
    </IDSHeader1177AdminAvatar>
  )
}
