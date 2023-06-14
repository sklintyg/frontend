import { IDSIcon } from '@frontend/ids-react-ts'
import { MouseEventHandler } from 'react'

export function HeaderAvatarMenuButton({
  label,
  icon,
  trigger,
  onClick,
}: {
  label: string
  icon: string
  trigger?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <button
      onClick={onClick}
      className="ids-link-block text-primary-40 mt-2 flex w-full items-center [&:not(:last-child)]:mb-5"
      trigger={trigger}
      type="button"
    >
      <div className="mr-2.5">
        <IDSIcon color="currentColor" color2="currentColor" height="20" width="20" name={icon} />
      </div>
      <div className="flex-auto text-left">{label}</div>
    </button>
  )
}
