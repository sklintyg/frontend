import { IDSTooltip } from '@frontend/ids-react-ts'
import { useTableContext } from './hooks/useTableContext'
import { SortingIcon } from './SortingIcon'

export function TableHeaderCell({ column, description }: { column: string; description?: string }) {
  const { sortOnColumn } = useTableContext()

  return (
    <th
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
      className="cursor-pointer select-none whitespace-nowrap first:rounded-tl-md last:rounded-tr-md">
      {!description && (
        <span className="align-middle">
          {column} <SortingIcon column={column} />
        </span>
      )}
      {description && (
        <IDSTooltip>
          <span slot="trigger">
            {column} <SortingIcon column={column} />
          </span>
          <p slot="tooltip" className="max-w-xs whitespace-normal md:max-w-sm">
            {description}
          </p>
        </IDSTooltip>
      )}
    </th>
  )
}
