import React from 'react'
import { useTableContext } from '../hooks/useTableContext'
import { TableRow } from './TableRow'
import { TableColumn } from '../../../schemas/tableSchema'

export function TableBody<T>({
  content,
  isItalic,
  tableValueExtractor,
  tableIdExtractor,
  onTableRowClick,
  columns,
  TableCellResolverComponent,
}: {
  content: T[]
  isItalic?: <S extends T>(data: S) => boolean
  tableValueExtractor: <S extends T>(column: string, data: S) => unknown
  tableIdExtractor: <S extends T>(data: S) => string
  onTableRowClick: (key: string) => void
  columns: TableColumn[]
  TableCellResolverComponent: React.Component<{ column: string; data: T }>
}) {
  const { sortTableList } = useTableContext()

  return (
    <tbody>
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
              {columns.map(({ name }) => (
                <TableCellResolverComponent key={tableIdExtractor(item)} column={name} data={item} />
              ))}
            </TableRow>
          )
      )}
    </tbody>
  )
}
