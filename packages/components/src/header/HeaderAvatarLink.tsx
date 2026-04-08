import type { ComponentProps, ReactNode } from 'react'
import { AppLink } from '../AppLink/AppLink'
import { Icon } from '../Icon/Icon'

export function HeaderAvatarLink({ to, icon, children }: { to: string; icon: ComponentProps<typeof Icon>['icon']; children: ReactNode }) {
  return (
    <AppLink to={to} block large colorPreset={2}>
      <Icon icon={icon} textStart />
      {children}
    </AppLink>
  )
}
