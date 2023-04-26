import { ReactNode } from 'react'
import { useAppSelector } from '../../../store/hooks'
import { allSjukfallColumns } from '../../../store/slices/sjukfallTableColumnsSelectors'

export function MaxColspanRow({ children }: { children: ReactNode }) {
  const columns = useAppSelector(allSjukfallColumns)
  const colspan = columns.filter(({ visible: checked }) => checked).length
  return (
    <tr>
      <td colSpan={colspan}>{children}</td>
    </tr>
  )
}
