import { MouseEventHandler, ReactNode } from 'react'

export function HeaderAvatarMenuButton({
  label,
  icon,
  trigger,
  onClick,
}: {
  label: string
  icon: ReactNode
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
      <div className="mr-2.5">{icon}</div>
      <div className="flex-auto text-left">{label}</div>
    </button>
  )
}
