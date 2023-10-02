import { ReactNode } from 'react'
import { PrintButton } from '../../PrintButton/PrintButton'

export function TableInfoLeft({ modifyTable, printable = false }: { modifyTable: ReactNode; printable?: boolean }) {
  return (
    <div className="mb-5 w-full print:hidden lg:flex lg:w-auto lg:items-end lg:gap-5 lg:print:hidden">
      <div className="mb-2 w-full lg:mb-0 lg:w-96">{modifyTable}</div>
      {printable && <PrintButton />}
    </div>
  )
}
