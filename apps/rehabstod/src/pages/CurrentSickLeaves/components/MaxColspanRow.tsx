import { ReactNode } from 'react'
import { useAppSelector } from '../../../store/hooks'
import { allSickLeaveColumns } from '../../../store/slices/sickLeaveTableColumns.selector'

export function MaxColspanRow({ children }: { children: ReactNode }) {
  const columns = useAppSelector(allSickLeaveColumns)
  const colspan = columns.filter(({ visible: checked }) => checked).length
  return (
    <tr>
      <td colSpan={colspan}>{children}</td>
    </tr>
  )
}
