import { ReactNode } from 'react'

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="ids-content m-auto max-w-7xl py-10 px-2.5">{children}</div>
}
