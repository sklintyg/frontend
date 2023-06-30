import { classNames } from '../../../utils/classNames'
import { Tooltip } from '../../Tooltip/Tooltip'
import { TooltipContent } from '../../Tooltip/TooltipContent'
import { TooltipTrigger } from '../../Tooltip/TooltipTrigger'
import { useTableContext } from '../hooks/useTableContext'
import { SortingIcon } from './SortingIcon'

export function TableHeaderCell({
  description,
  column,
  width,
  sticky,
}: {
  column: string
  description?: string
  width?: string
  sticky?: 'left' | 'top' | 'right'
}) {
  const { sortOnColumn, ascending } = useTableContext()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <th
          style={{ width: width ?? '25%', zIndex: 11 }}
          tabIndex={0}
          role="columnheader"
          scope="col"
          aria-sort={ascending ? 'ascending' : 'descending'}
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
          className={classNames(
            'cursor-pointer',
            'select-none',
            'overflow-hidden',
            'text-ellipsis',
            'whitespace-nowrap',
            'first:rounded-tl-md',
            'last:rounded-tr-md',
            'border-l-0',
            sticky != null && `sticky z-60`,
            classNames(sticky === 'right' && 'right-0', sticky === 'left' && 'left-0', sticky === 'top' && 'top-0')
          )}
        >
          <span>
            {column} <SortingIcon column={column} />
          </span>
          {description && <TooltipContent>{description}</TooltipContent>}
        </th>
      </TooltipTrigger>
    </Tooltip>
  )
}
