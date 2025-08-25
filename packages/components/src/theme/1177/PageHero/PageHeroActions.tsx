import type { ReactNode } from 'react'
import { hasNoChildren } from '../../../utils/hasNoChildren'

export function PageHeroActions({ children }: { children: ReactNode }) {
  if (hasNoChildren(children)) {
    return null
  }

  return (
    <div className="mb-5 text-left md:text-center">
      <div style={{ borderColor: 'var(--color-stone-clear)' }} className="mb-5 mt-8 w-[43px] border-b md:hidden" />
      <div className="mx-auto inline-flex flex-col gap-2.5 md:flex-row">{children}</div>
    </div>
  )
}
