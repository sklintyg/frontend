import { classNames } from '@frontend/components'
import { IDSIconArrow, IDSIconSwap } from '@frontend/ids-react-ts'
import { useTableContext } from '../hooks/useTableContext'

export function SortingIcon({ column }: { column: string }) {
  const { ascending, sortColumn } = useTableContext()
  const sorting = sortColumn === column

  return (
    <div className="relative ml-1 inline-block h-3">
      {!sorting && <IDSIconSwap rotate="90" width="14" height="14" className="absolute inset-y-0" />}
      {sorting && (
        <>
          <IDSIconArrow
            className={classNames('absolute inset-y-0', sorting && !ascending && 'hidden')}
            rotate="270"
            width="14"
            height="14"
          />
          <IDSIconArrow className={classNames('absolute inset-y-0', sorting && ascending && 'hidden')} rotate="90" width="14" height="14" />
        </>
      )}
    </div>
  )
}
