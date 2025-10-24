import { Icon } from '@frontend/components'
import type { ComponentProps, MouseEventHandler, ReactNode } from 'react'

export function HeaderAvatarMenuButton({
  children,
  icon,
  onClick,
}: {
  children: ReactNode
  icon: ComponentProps<typeof Icon>['icon']
  onClick: MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <button type="button" className="ids-link ids-link--icon ids-link--large ids-link--block text-left" onClick={onClick}>
      <Icon icon={icon} textStart />
      {children}
    </button>
  )
}
