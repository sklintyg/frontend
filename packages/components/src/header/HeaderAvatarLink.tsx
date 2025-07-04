import type { ComponentProps, ReactNode } from 'react'
import { AppLink } from '../AppLink'
import { Icon } from '../Icon/Icon'

export function HeaderAvatarLink({ to, icon, children }: { to: string; icon: ComponentProps<typeof Icon>['icon']; children: ReactNode }) {
  return (
    <AppLink to={to} block colorPreset={2} large>
      <Icon icon={icon} textStart />
      {children}
    </AppLink>
  )
}
