import { classNames } from '@frontend/components'
import type { ReactNode } from 'react'

export function TableInfoItem({ children, noPrintAfter = false }: { children: ReactNode; noPrintAfter?: boolean }) {
  return (
    <div
      className={classNames(
        noPrintAfter && "print:after:content-['_']",
        'after:mx-1',
        'after:hidden',
        "after:content-['|']",
        'print:after:inline-block',
        'print:inline-block',
        'xl:inline-block',
        '[&:not(:last-child)]:after:xl:inline-block'
      )}
    >
      {children}
    </div>
  )
}
