import { IDSIcon } from '@frontend/ids-react-ts'
import { classNames } from '../../utils/classNames'
import { useTableContext } from './hooks/useTableContext'

export function SortingIcon({ column }: { column: string }) {
  const { ascending, column: currentColumn } = useTableContext()
  const sorting = currentColumn === column

  return (
    <div className="relative ml-1 inline-block h-3">
      {!sorting && <IDSIcon name="swap" rotate="90" width="14" height="14" className="absolute inset-y-0" />}
      {sorting && (
        <>
          <IDSIcon
            className={classNames('absolute inset-y-0', sorting && !ascending && 'hidden')}
            name="arrow"
            rotate="270"
            width="14"
            height="14"
          />
          <IDSIcon
            className={classNames('absolute inset-y-0', sorting && ascending && 'hidden')}
            name="arrow"
            rotate="90"
            width="14"
            height="14"
          />
        </>
      )}
    </div>
  )
}
