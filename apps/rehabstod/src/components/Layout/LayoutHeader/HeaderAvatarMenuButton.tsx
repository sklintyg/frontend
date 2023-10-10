import { MouseEventHandler, ReactNode } from 'react'

export function HeaderAvatarMenuButton({
  label,
  icon,
  trigger,
  onClick,
  testid,
}: {
  label: string
  icon: ReactNode
  trigger?: string
  testid: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <button
      onClick={onClick}
      className="ids-link-block mt-2 flex w-full items-center text-primary-40 [&:not(:last-child)]:mb-5"
      trigger={trigger}
      data-testid={testid}
      type="button"
    >
      <div className="mr-2.5">{icon}</div>
      <div className="flex-auto text-left">{label}</div>
    </button>
  )
}
