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
    <>
      {!sorting && <span style={iconStyle} className="ids-icon-swap-vertical-small ids-data-table__icon" />}
      {sorting && !ascending && <span style={iconStyle} className="ids-icon-arrow-up-small ids-data-table__icon" />}
      {sorting && ascending && <span style={iconStyle} className="ids-icon-arrow-down-small ids-data-table__icon" />}
    </>
  )
}
