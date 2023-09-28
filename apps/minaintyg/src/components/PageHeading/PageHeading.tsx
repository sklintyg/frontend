import { hasNoChildren } from '@frontend/components'
import { ReactNode } from 'react'

export function PageHeading({ heading, children }: { heading?: string; children?: ReactNode }) {
  return (
    <header className="ids-content mb-7">
      {heading && <h1 className="ids-heading-1 text-[min(2.25rem,9.25vw)]/[min(2.25rem,9.25vw)] md:text-5xl">{heading}</h1>}
      {!hasNoChildren(children) && <div className="ids-preamble mb-2 text-lg md:text-[1.375rem]/[2.25rem]">{children}</div>}
    </header>
  )
}
