import type { MouseEventHandler } from 'react'

export function HeaderAvatarMenuButton({
  label,
  icon,
  onClick,
  testid,
}: {
  label: string
  icon: string
  testid: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <button
      className={`ids-icon-${icon} ids-link--start-icon ids-link ids-link--block ids-link--large h-auto text-left`}
      type="button"
      onClick={onClick}
      data-testid={testid}
    >
      {label}
    </button>
  )
}
