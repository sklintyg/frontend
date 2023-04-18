import { Tooltip } from '../Tooltip/Tooltip'
import { TooltipContent } from '../Tooltip/TooltipContent'
import { TooltipTrigger } from '../Tooltip/TooltipTrigger'
import { useTableContext } from './hooks/useTableContext'
import { SortingIcon } from './SortingIcon'

export function TableHeaderCell({ description, column, width }: { column: string; description?: string; width?: string }) {
  const { sortOnColumn } = useTableContext()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <th
          style={{ width: width ?? '25%' }}
          tabIndex={0}
          onKeyDown={({ code, currentTarget }) => {
            if (code === 'Enter' || code === 'Space') {
              sortOnColumn(column)
            }
            if (code === 'ArrowLeft' && currentTarget.previousElementSibling) {
              ;(currentTarget.previousElementSibling as HTMLElement).focus()
            }
            if (code === 'ArrowRight' && currentTarget.nextElementSibling) {
              ;(currentTarget.nextElementSibling as HTMLElement).focus()
            }
          }}
          onClick={() => sortOnColumn(column)}
          className="cursor-pointer select-none overflow-hidden text-ellipsis whitespace-nowrap first:rounded-tl-md last:rounded-tr-md">
          <span>
            {column} <SortingIcon column={column} />
          </span>
          {description && <TooltipContent>{description}</TooltipContent>}
        </th>
      </TooltipTrigger>
    </Tooltip>
  )
}
