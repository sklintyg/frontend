import { ReactNode } from 'react'

export function TableInfoItem({ children }: { children: ReactNode }) {
  return (
    <div className="after:mx-1 after:hidden after:content-['|'] xl:inline-block [&:not(:last-child)]:after:xl:inline-block">{children}</div>
  )
}
