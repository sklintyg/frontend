import type { ReactNode } from 'react'

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="ids-content relative m-auto max-w-screen-xxl px-5 py-10">{children}</div>
}
