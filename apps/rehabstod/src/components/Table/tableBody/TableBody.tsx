import { ReactNode } from 'react'
import { useTableContext } from '../hooks/useTableContext'
import { TableRow } from './TableRow'
import { TableColumn } from '../../../schemas/tableSchema'

export function TableBody<T>({
  content,
  isItalic,
  tableValueExtractor,
  tableCellExtractor,
  tableIdExtractor,
  onTableRowClick,
  columns,
}: {
  content: T[]
  isItalic?: <S extends T>(data: S) => boolean
  tableValueExtractor: <S extends T>(column: string, data: S) => unknown
  tableCellExtractor: <S extends T>(column: string, data: S) => ReactNode
  tableIdExtractor: <S extends T>(data: S) => string
  onTableRowClick: (key: string) => void
  columns: TableColumn[]
}) {
  const { sortTableList } = useTableContext()

  return (
    <>
      {sortTableList(content, tableValueExtractor).map(
        (item) =>
          columns.length > 0 && (
            <TableRow
              key={tableIdExtractor(item)}
              italic={isItalic ? isItalic(item) : false}
              id={tableIdExtractor(item)}
              onNavigate={onTableRowClick}
              focusable
            >
              {columns.map(({ name }) => tableCellExtractor(name, item))}
            </TableRow>
          )
      )}
    </>
  )
}
