import { classNames, Icon } from '@frontend/components'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../../../hooks/useLogout'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowSettingsDialog } from '../../../store/slices/settings.slice'
import { HeaderAvatarMenuButton } from './HeaderAvatarMenuButton'

export function HeaderAvatarMenu({ name, unit }: { name: string; unit: string }) {
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { logout } = useLogout()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (dropdownRef?.current?.contains(event.target as Node) === false) {
        setOpen(false)
      }
    }

    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [open])

  return (
    <div className="ids-header-1177-admin__avatar ids-header-1177-admin__avatar--expanded">
      <button
        type="button"
        data-testid="avatar-menu"
        onClick={(event) => {
          event.stopPropagation()
          setOpen(!open)
        }}
        className="ids-header-1177-admin__avatar-box"
        aria-expanded={open}
      >
        <div className="ids-header-1177-admin__avatar-icon" />
        <div className="ids-header-1177-admin__avatar-content">
          <div className="ids-header-1177-admin__avatar-content__name">{name}</div>
          <div className="ids-header-1177-admin__avatar-content__unit">{unit}</div>
        </div>
        <div className={classNames('ids-header-1177-admin__avatar-chevron', open && 'ids-header-1177-admin__avatar-chevron--expanded')} />
      </button>

      {open && (
        <div ref={dropdownRef} className="ids-header-1177-admin__avatar-dropdown">
          <Link to="/enhet" className="ids-link ids-link--icon ids-link--large ids-link--block">
            <Icon icon="swap-horizontal" textStart />
            Byt vårdenhet
          </Link>

          <HeaderAvatarMenuButton icon="settings" onClick={() => dispatch(updateShowSettingsDialog(true))}>
            Inställningar
          </HeaderAvatarMenuButton>

          <hr className="ids-header-1177-admin__link-separator" />

          <HeaderAvatarMenuButton icon="user" onClick={logout}>
            Logga ut
          </HeaderAvatarMenuButton>
        </div>
      )}
    </div>
  )
}
