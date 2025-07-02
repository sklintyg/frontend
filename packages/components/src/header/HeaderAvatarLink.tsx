import type { ReactNode } from 'react'
import { AppLink } from '../AppLink'

export function HeaderAvatarLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <AppLink to={to} block colorPreset={2} large>
      {children}
    </AppLink>
  )
}
