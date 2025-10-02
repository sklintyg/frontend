import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../../../hooks/useLogout'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowSettingsDialog } from '../../../store/slices/settings.slice'
import { classNames } from '../../../utils/classNames'

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
          <Link to="/enhet" className="ids-icon-swap-horizontal ids-link--start-icon ids-link ids-link--large ids-link--block text-left">
            Byt vårdenhet
          </Link>

          <button
            type="button"
            className="ids-icon-settings ids-link--start-icon ids-link ids-link--large ids-link--block text-left"
            onClick={() => dispatch(updateShowSettingsDialog(true))}
          >
            Inställningar
          </button>

          <hr className="ids-header-1177-admin__link-separator" />

          <button
            type="button"
            className="ids-icon-user ids-link--start-icon ids-link ids-link--large ids-link--block text-left"
            data-testid="logout-button"
            onClick={logout}
          >
            Logga ut
          </button>
        </div>
      )}
    </div>
  )
}
