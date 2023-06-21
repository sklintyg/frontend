import { useTableContext } from '../hooks/useTableContext'
import { TableColumn } from '../../../schemas/tableSchema'

export function PrintTableBody<T>({
  content,
  tableValueExtractor,
  tableIdExtractor,
  TableCellResolverComponent,
  columns,
}: {
  content: T[]
  tableValueExtractor: <S extends T>(column: string, data: S) => unknown
  tableIdExtractor: <S extends T>(data: S) => string
  columns: TableColumn[]
  TableCellResolverComponent: <S extends T>({ column, data }: { column: string; data: S }) => JSX.Element
}) {
  const { sortTableList } = useTableContext()

  return (
    <div className="hidden print:block">
      {sortTableList(content, tableValueExtractor).map((item) => (
        <div key={`${tableIdExtractor(item)}-print`} className="border-neutral-40 -mb-px columns-3 break-inside-avoid gap-2 border p-4">
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
