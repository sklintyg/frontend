import { ReactNode } from 'react'
import { useTableContext } from '../hooks/useTableContext'
import { TableRow } from './TableRow'
import { TableColumn } from '../../../schemas/tableSchema'

export function TableBody<T>({
  content,
  isItalic,
  tableValueExtractor,
  tableCellExtractor,
  onTableRowClick,
  columns,
  keyIndex,
}: {
  content: T[]
  isItalic?: <S extends T>(data: S) => boolean
  tableValueExtractor: <S extends T>(column: string, data: S) => unknown
  tableCellExtractor: <S extends T>(column: string, data: S) => ReactNode
  onTableRowClick: (key: string) => void
  columns: TableColumn[]
  keyIndex: keyof T
}) {
  const { sortTableList } = useTableContext()

  return (
    <>
      {sortTableList(content, tableValueExtractor).map(
        (item) =>
          columns.length > 0 && (
            <TableRow
              key={item[keyIndex] as string}
              italic={isItalic ? isItalic(item) : false}
              id={item[keyIndex] as string}
              onClick={onTableRowClick}
            >
              {columns.map(({ name }) => tableCellExtractor(name, item))}
            </TableRow>
          )
      )}
    </>
  )
}
