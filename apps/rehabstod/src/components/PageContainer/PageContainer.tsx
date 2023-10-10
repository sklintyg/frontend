import { ReactNode } from 'react'

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="px-5">
      <div className="ids-content relative m-auto max-w-screen-xxl py-10">
        <div>{children}</div>
      </div>
    </div>
  )
}
