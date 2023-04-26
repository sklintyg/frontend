// import { disableColumn, enableColumn, PatientColumn, toggleAll } from '../../store/slices/patientTableColumnsSlice'
import { TableColumn } from '../../schemas/tableSchema'
import { Checkbox } from '../Form/Checkbox'
import { SelectMultiple } from '../Form/SelectMultiple'

export function ModifyTableColumns({
  columns,
  onChecked,
  onShowAll,
}: {
  columns: TableColumn[]
  onChecked: (column: string, checked: boolean) => void
  onShowAll: () => void
}) {
  const selectedColumns = columns.filter(({ visible }) => visible)
  const isAllSelected = selectedColumns.length === columns.length
  const getPlaceholder = () => {
    if (isAllSelected) {
      return 'Visa alla'
    }

    if (selectedColumns.length === 1) {
      const { name } = selectedColumns[0]
      return name
    }

    return `Visa ${selectedColumns.length} kolumner`
  }

  return (
    <SelectMultiple
      label="Anpassa tabeller"
      description="Välj vilka kolumner du vill se och i vilken ordning dessa ska ligga. Ändringarna sparas tillsvidare. Kolumner som du väljer att ta bort kan du inte filtrera på."
      placeholder={getPlaceholder()}>
      <Checkbox
        checked={isAllSelected}
        disabled={isAllSelected}
        label="Markera alla"
        onChange={() => {
          if (!isAllSelected) {
            onShowAll()
          }
        }}
      />
      {columns.map(({ name, visible, disabled }) => (
        <Checkbox
          key={name}
          checked={visible}
          disabled={disabled}
          label={name}
          onChange={(event) => {
            onChecked(name, event.currentTarget.checked)
          }}
        />
      ))}
    </SelectMultiple>
  )
}
