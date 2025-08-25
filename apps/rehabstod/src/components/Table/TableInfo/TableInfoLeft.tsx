import type { ReactNode } from 'react'
import { Button } from '../../Button/Button'

export function TableInfoLeft({ modifyTable, printable = false }: { modifyTable: ReactNode; printable?: boolean }) {
  return (
    <div className="mb-5 w-full print:hidden lg:flex lg:w-auto lg:items-end lg:gap-5 lg:print:hidden">
      <div className="mb-2 w-full lg:mb-0 lg:w-96">{modifyTable}</div>
      {printable && (
        <Button size="m" secondary mblock onClick={() => window.print()} className="whitespace-nowrap">
          <span className="ids-icon-print" />
          Skriv ut
        </Button>
      )}
    </div>
  )
}
