import { hasNoChildren } from '@frontend/components'
import type { ReactNode } from 'react'

export function ValidationError({ children }: { children: ReactNode }) {
  if (hasNoChildren(children)) {
    return null
  }

  return (
    <p className="iu-color-error" role="alert">
      {children instanceof Array ? children[0] : children}
    </p>
  )
}
