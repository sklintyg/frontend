import { TableHeaderCell } from './TableHeaderCell'
import { Column } from '../types/Column'

export function TableHeader({ columns }: { columns: Column[] }) {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <TableHeaderCell
            key={column.name}
            column={column.name}
            width={`${column.width}px`}
            sticky={column.sticky}
            sortable={column.sortable}
          />
        ))}
      </tr>
    </thead>
  )
}
