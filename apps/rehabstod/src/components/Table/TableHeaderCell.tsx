import { Tooltip } from '../Tooltip/Tooltip'
import { TooltipContent } from '../Tooltip/TooltipContent'
import { TooltipTrigger } from '../Tooltip/TooltipTrigger'
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
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableHeaderCellElement>) => {
    if (event.key === 'Enter') {
      onColumnSort(column)
    }
  }

  return (
    <th
      tabIndex={0}
      onKeyDown={(event) => handleKeyDown(event)}
      onClick={() => onColumnSort(column)}
      className="cursor-pointer select-none whitespace-nowrap first:rounded-tl-md last:rounded-tr-md">
      {!description && (
        <span className="align-middle">
          {title} <SortingIcon ascending={ascending} sorting={currentColumn === column} />
        </span>
      )}
      {description && (
        <Tooltip>
          <TooltipTrigger>
            <span>
              {title} <SortingIcon ascending={ascending} sorting={currentColumn === column} />
            </span>
          </TooltipTrigger>
          <TooltipContent>{description}</TooltipContent>
        </Tooltip>
      )}
    </th>
  )
}
