import { IDSTooltip } from '@frontend/ids-react-ts'
import { SortingIcon } from './SortingIcon'

export function TableHeaderCell<T extends string>({
  title,
  description,
  ascending,
  column,
  currentColumn,
  onColumnSort,
}: {
  title: string
  description?: string
  ascending: boolean
  column: T
  currentColumn: string
  onColumnSort: (column: T) => void
}) {
  return (
    <th
      tabIndex={0}
      onClick={() => onColumnSort(column)}
      className="cursor-pointer select-none whitespace-nowrap first:rounded-tl-md last:rounded-tr-md">
      {!description && (
        <span className="align-middle">
          {title} <SortingIcon ascending={ascending} sorting={currentColumn === column} />
        </span>
      )}
      {description && (
        <IDSTooltip>
          <span slot="trigger">
            {title} <SortingIcon ascending={ascending} sorting={currentColumn === column} />
          </span>
          <p slot="tooltip" className="max-w-xs whitespace-normal md:max-w-sm">
            {description}
          </p>
        </IDSTooltip>
      )}
    </th>
  )
}
