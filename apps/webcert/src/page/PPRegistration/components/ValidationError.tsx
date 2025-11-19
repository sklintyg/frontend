import { hasNoChildren } from '@frontend/components'
import type { ReactNode } from 'react'

export function ValidationError({ children }: { children: ReactNode }) {
  if (hasNoChildren(children)) {
    return null
  }

  if (children instanceof Array) {
    return <p className="iu-color-error">{children[0]}</p>
  }

  return <p className="iu-color-error">{children}</p>
}
