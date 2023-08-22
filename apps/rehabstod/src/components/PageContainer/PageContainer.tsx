import { ReactNode } from 'react'

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="px-5">
      <div className="ids-content m-auto max-w-7xl py-10">{children}</div>
    </div>
  )
}
