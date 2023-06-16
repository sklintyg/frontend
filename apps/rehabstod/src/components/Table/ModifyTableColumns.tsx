import { IDSButton } from '@frontend/ids-react-ts'
import { TableColumn } from '../../schemas/tableSchema'
import { Checkbox } from '../Form/Checkbox'
import { SelectMultiple } from '../Form/SelectMultiple'
import { MoveColumnButton } from './MoveColumnButton'

export function ModifyTableColumns({
  columns,
  onChecked,
  onMove,
  onReset,
  onShowAll,
}: {
  columns: TableColumn[]
  onChecked: (column: string, checked: boolean) => void
  onMove: (column: string, direction: 'left' | 'right') => void
  onReset: () => void
  onShowAll: () => void
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
      description="Välj kolumner och i vilken ordning de ska visas. Dina ändringar sparas tills vidare. Borttagna kolumner går inte att filtrera."
      placeholder={getPlaceholder()}
      actions={
        <>
          <IDSButton onClick={() => onReset()} tertiary className="flex-1 text-center" size="s" block>
            Återställ
          </IDSButton>
          <IDSButton onClick={() => onShowAll()} className="flex-1 whitespace-nowrap" size="s" block>
            Välj alla
          </IDSButton>
        </>
      }
    >
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
