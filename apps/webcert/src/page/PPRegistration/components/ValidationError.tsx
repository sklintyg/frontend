import { hasNoChildren } from '@frontend/components'
import type { ReactNode } from 'react'

export function ValidationError({ children }: { children: ReactNode }) {
  if (hasNoChildren(children)) {
    return null
  }
  return <p className="iu-color-error">{children}</p>
}
