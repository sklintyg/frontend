import type { ReactNode } from 'react'

export function PageHeading({ heading, children }: { heading?: string; children?: ReactNode }) {
  return (
    <header className="ids-content mb-7">
      {heading && <h1 className="ids-heading-1">{heading}</h1>}
      {children}
    </header>
  )
}
