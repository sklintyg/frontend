import { IDSIconArrow, IDSIconSwap } from '@inera/ids-react'
import { classNames } from '../../../utils/classNames'
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
