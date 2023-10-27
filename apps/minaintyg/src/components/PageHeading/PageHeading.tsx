import { ReactNode } from 'react'

export function PageHeading({ heading, children }: { heading?: string; children?: ReactNode }) {
  return (
    <header className="ids-content mb-7">
      {heading && <h1 className="ids-heading-1 text-[min(2.25rem,9.25vw)]/[min(2.25rem,9.25vw)] md:text-5xl">{heading}</h1>}
      {children}
    </header>
  )
}
