import { classNames } from '../../../utils/classNames'
import { Tooltip, TooltipTrigger } from '../../Tooltip'
import { useTableContext } from '../hooks/useTableContext'
import { SortingIcon } from './SortingIcon'

export function TableHeaderCell({
  column,
  width,
  sticky,
  sortable = true,
}: {
  column: string
  width?: string
  sticky?: 'left' | 'top' | 'right'
  sortable?: boolean
}) {
  const { sortOnColumn, ascending } = useTableContext()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <th
          style={{
            width: width ?? '25%',
            zIndex: 11,
            background: 'var(--IDS-DATA-TABLE__HEAD-BACKGROUND_COLOR)',
            borderBottom: '.125rem solid var(--IDS-DATA-TABLE__CELL-BORDER_COLOR)',
            fontFamily: 'var(--IDS-DATA-TABLE__HEAD-FONT-FAMILY)',
          }}
          tabIndex={sortable ? 0 : undefined}
          role="columnheader"
          scope="col"
          aria-sort={ascending ? 'ascending' : 'descending'}
          onKeyDown={({ code, currentTarget }) => {
            if (code === 'Enter' || code === 'Space') {
              if (sortable) {
                sortOnColumn(column)
              }
            }
            if (code === 'ArrowLeft' && currentTarget.previousElementSibling) {
              ;(currentTarget.previousElementSibling as HTMLElement).focus()
            }
            if (code === 'ArrowRight' && currentTarget.nextElementSibling) {
              ;(currentTarget.nextElementSibling as HTMLElement).focus()
            }
          }}
          onClick={!sortable ? () => {} : () => sortOnColumn(column)}
          className={classNames(
            sortable && 'cursor-pointer',
            'select-none',
            'overflow-hidden',
            'text-ellipsis',
            'whitespace-nowrap',
            'text-left leading-5 font-bold p-2 first:p-4 last:p-4',
            sticky != null && `sticky z-60`,
            classNames(sticky === 'right' && 'right-0', sticky === 'left' && 'left-0', sticky === 'top' && 'top-0')
          )}
        >
          {column} {sortable && <SortingIcon column={column} />}
        </th>
      </TooltipTrigger>
    </Tooltip>
  )
}
