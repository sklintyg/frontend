import { Icon } from '@frontend/components'
import type { ComponentProps, MouseEventHandler, ReactNode } from 'react'

export function HeaderAvatarMenuButton({
  children,
  icon,
  onClick,
  'data-testid': dataTestId,
}: {
  children: ReactNode
  icon: ComponentProps<typeof Icon>['icon']
  onClick: MouseEventHandler<HTMLButtonElement>
  'data-testid'?: string
}) {
  return (
    <button
      type="button"
      className="ids-link ids-link--icon ids-link--large ids-link--block text-left"
      onClick={onClick}
      data-testid={dataTestId}
    >
      <Icon icon={icon} textStart />
      {children}
    </button>
  )
}
