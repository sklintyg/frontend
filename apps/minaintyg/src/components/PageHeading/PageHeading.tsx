import { Heading } from '@frontend/components'
import type { ReactNode } from 'react'

export function PageHeading({ heading, children }: { heading?: string; children?: ReactNode }) {
  return (
    <header className="ids-content mb-7">
      {heading && (
        <Heading level={1} size="xxl">
          {heading}
        </Heading>
      )}
      {children}
    </header>
  )
}
