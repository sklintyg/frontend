import type { ReactNode } from 'react'
import { TableCell } from './TableCell'
import { TableRow } from './TableRow'

export function MaxColspanRow({ children, colspan }: { children: ReactNode; colspan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colspan}>{children}</TableCell>
    </TableRow>
  )
}
