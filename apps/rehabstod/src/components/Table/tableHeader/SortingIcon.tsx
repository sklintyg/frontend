import { useTableContext } from '../hooks/useTableContext'

const iconStyle = {
  marginLeft: '.5rem',
  marginBottom: '-0.125rem',
  color: 'var(--IDS-ICON__COLOR)',
}

export function SortingIcon({ column }: { column: string }) {
  const { ascending, sortColumn } = useTableContext()
  const sorting = sortColumn === column

  return (
    <div className="relative ml-1 inline-block h-3">
      {!sorting && <span style={iconStyle} className="ids-icon-swap-vertical-small ids-data-table__icon" />}
      {sorting && ascending && <span style={iconStyle} className="ids-icon-arrow-up-small ids-data-table__icon" />}
      {sorting && !ascending && <span style={iconStyle} className="ids-icon-arrow-down-small ids-data-table__icon" />}
      {/* {!sorting && <IDSIconSwap rotate="90" width="14" height="14" className="absolute inset-y-0" />}
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
      )} */}
    </div>
  )
}
