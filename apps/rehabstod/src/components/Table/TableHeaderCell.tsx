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
  width,
}: {
  title: string
  description?: string
  ascending: boolean
  column: T
  currentColumn: string
  onColumnSort: (column: T) => void
  width?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <th
          style={{ width: width ?? '25%' }}
          tabIndex={0}
          onKeyDown={({ code, currentTarget }) => {
            if (code === 'Enter' || code === 'Space') {
              onColumnSort(column)
            }
            if (code === 'ArrowLeft' && currentTarget.previousElementSibling) {
              ;(currentTarget.previousElementSibling as HTMLElement).focus()
            }
            if (code === 'ArrowRight' && currentTarget.nextElementSibling) {
              ;(currentTarget.nextElementSibling as HTMLElement).focus()
            }
          }}
          onClick={() => onColumnSort(column)}
          className="cursor-pointer select-none overflow-hidden text-ellipsis whitespace-nowrap first:rounded-tl-md last:rounded-tr-md">
          <span>
            {title} <SortingIcon ascending={ascending} sorting={currentColumn === column} />
          </span>
          {description && <TooltipContent>{description}</TooltipContent>}
        </th>
      </TooltipTrigger>
    </Tooltip>
  )
}
