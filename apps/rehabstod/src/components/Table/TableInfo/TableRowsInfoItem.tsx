import { TableInfoItem } from './TableInfoItem'

export function TableRowsInfoItem({ listLength, totalNumber }: { listLength: number; totalNumber: number }) {
  return (
    <TableInfoItem>
      Visar{' '}
      <span className="font-bold">
        {listLength} av {totalNumber}
      </span>
    </TableInfoItem>
  )
}
