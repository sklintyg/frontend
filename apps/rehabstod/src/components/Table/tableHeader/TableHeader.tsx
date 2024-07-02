import type { Column } from '../types/Column'
import { TableHeaderCell } from './TableHeaderCell'

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
