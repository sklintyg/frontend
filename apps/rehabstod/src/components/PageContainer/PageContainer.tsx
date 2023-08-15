import { ReactNode } from 'react'

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="ids-content m-auto py-10 px-5">{children}</div>
}
