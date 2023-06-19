import { TableHeaderCell } from './TableHeaderCell'

export interface Column {
  name: string
  width?: number
  description?: string
}

export function TableHeader({ columns }: { columns: Column[] }) {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <TableHeaderCell key={column.name} column={column.name} description={column.description} width={`${column.width}px`} />
        ))}
      </tr>
    </thead>
  )
}
