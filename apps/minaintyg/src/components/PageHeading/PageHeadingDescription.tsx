import { ReactNode } from 'react'

export function PageHeadingDescription({ children }: { children: ReactNode }) {
  return <div className="ids-preamble mb-2 text-lg md:text-[1.375rem]/[2.25rem]">{children}</div>
}
