import { TableColumn } from '../../schemas/tableSchema'
import { Checkbox } from '../Form/Checkbox'
import { SelectMultiple } from '../Form/SelectMultiple'
import { MoveColumnButton } from './MoveColumnButton'

export function ModifyTableColumns({
  columns,
  onChecked,
  onShowAll,
  onMove,
}: {
  columns: TableColumn[]
  onChecked: (column: string, checked: boolean) => void
  onShowAll: () => void
  onMove: (column: string, direction: 'left' | 'right') => void
}) {
  const selectedColumns = columns.filter(({ visible }) => visible)
  const isAllSelected = selectedColumns.length === columns.length
  const numVisible = columns.reduce((result, { visible }) => result + (visible ? 1 : 0), 0)
  const getPlaceholder = () => {
    if (isAllSelected) {
      return 'Alla valda'
    }

    if (selectedColumns.length === 1) {
      const { name } = selectedColumns[0]
      return name
    }

    return `Visar ${selectedColumns.length} kolumner`
  }

  return (
    <SelectMultiple
      label="Anpassa tabeller"
      description="Välj vilka kolumner du vill se och i vilken ordning dessa ska ligga. Ändringarna sparas tillsvidare. Kolumner som du väljer att ta bort kan du inte filtrera på."
      placeholder={getPlaceholder()}>
      <Checkbox
        checked={isAllSelected}
        disabled={isAllSelected}
        label="Välj alla"
        onChange={() => {
          if (!isAllSelected) {
            onShowAll()
          }
        }}
      />
      {columns.map(({ name, visible, disabled }, index) => (
        <div key={name} data-testid={`${name.toLowerCase()}-column`} className="flex">
          <div className="-mt-3 w-full">
            <Checkbox
              checked={visible}
              disabled={disabled || (numVisible === 1 && visible)}
              label={name}
              onChange={(event) => {
                onChecked(name, event.currentTarget.checked)
              }}
            />
          </div>
          <MoveColumnButton disabled={index === 0} direction="left" onClick={() => onMove(name, 'left')} column={name} />

          <MoveColumnButton disabled={index === columns.length - 1} direction="right" column={name} onClick={() => onMove(name, 'right')} />
        </div>
      ))}
    </SelectMultiple>
  )
}
