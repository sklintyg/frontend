import { ReactNode } from 'react'
import { useAppSelector } from '../../../store/hooks'

export function MaxColspanRow({ children }: { children: ReactNode }) {
  const columns = useAppSelector((state) => state.sjukfallTableColumns)
  const colspan = columns.filter(({ enabled }) => enabled).length
  return (
    <tr>
      <td colSpan={colspan}>{children}</td>
    </tr>
  )
}
