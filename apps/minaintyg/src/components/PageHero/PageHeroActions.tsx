import { ReactNode } from 'react'

export function PageHeroActions({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 text-left md:text-center">
      <div className="mb-5 mt-8 w-[43px] border-b border-stone-clear md:hidden" />
      <div className="mx-auto inline-flex flex-col gap-2.5 md:flex-row">{children}</div>
    </div>
  )
}
