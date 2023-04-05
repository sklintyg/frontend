import { ReactNode } from 'react'
import { SickLeaveColumn } from '../../../schemas/sickLeaveSchema'

export function MaxColspanRow({ children }: { children: ReactNode }) {
  return (
    <tr>
      <td colSpan={Object.values(SickLeaveColumn).length}>{children}</td>
    </tr>
  )
}
