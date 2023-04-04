import { ReactNode } from 'react'
import { SickLeaveColumn } from '../../../store/types/sickLeave'

export function MaxColspanRow({ children }: { children: ReactNode }) {
  return (
    <tr>
      <td colSpan={Object.values(SickLeaveColumn).length}>{children}</td>
    </tr>
  )
}
