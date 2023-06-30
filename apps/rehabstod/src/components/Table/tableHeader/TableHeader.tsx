import { TableHeaderCell } from './TableHeaderCell'

export interface Column {
  name: string
  width?: number
  description?: string
  sticky?: 'left' | 'top' | 'right'
}

export function TableHeader({ columns }: { columns: Column[] }) {
  return (
    <tr>
      {columns.map((column) => (
        <TableHeaderCell
          key={column.name}
          column={column.name}
          description={column.description}
          width={`${column.width}px`}
          sticky={column.sticky}
        />
      ))}
    </tr>
  )
}
