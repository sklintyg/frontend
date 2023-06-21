import React from 'react'
import { useTableContext } from '../hooks/useTableContext'
import { TableColumn } from '../../../schemas/tableSchema'

export function PrintTableBody<T>({
  content,
  tableValueExtractor,
  TableCellResolverComponent,
  columns,
  keyIndex,
}: {
  content: T[]
  tableValueExtractor: <S extends T>(column: string, data: S) => unknown
  columns: TableColumn[]
  TableCellResolverComponent: React.Component
  keyIndex: keyof T
}) {
  const { sortTableList } = useTableContext()

  return (
    <div className="hidden print:block">
      {sortTableList(content, tableValueExtractor).map((item) => (
        <div key={item[keyIndex] as string} className="border-neutral-40 -mb-px columns-3 break-inside-avoid gap-2 border p-4">
          {columns.length > 0 &&
            columns.map(({ name }) => (
              <div key={name} className="flex gap-1">
                <div className="w-5/12 font-bold">{name}:</div>
                <TableCellResolverComponent column={name} data={item} />
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
