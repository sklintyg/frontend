import { Checkbox } from '../../../components/Form/Checkbox'
import { SelectMultiple } from '../../../components/Form/SelectMultiple'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { disableColumn, enableColumn, PatientColumn, toggleAll } from '../../../store/slices/patientTableColumnsSlice'

export function PatientModifyTable() {
  const columns = useAppSelector((state) => state.patientTableColumns)
  const dispatch = useAppDispatch()
  const selectableColumns = columns.filter(({ name }) => name !== PatientColumn.Intyg)
  const selectedColumns = selectableColumns.filter(({ enabled }) => enabled)
  const isAllSelected = selectedColumns.length === selectableColumns.length
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
      <Checkbox checked={isAllSelected} label="Markera alla" onChange={() => dispatch(toggleAll(!isAllSelected))} />
      {selectableColumns.map(({ name, enabled }) => (
        <Checkbox
          key={name}
          checked={enabled}
          label={name}
          onChange={(event) => {
            dispatch(event.currentTarget.checked ? enableColumn(name) : disableColumn(name))
          }}
        />
      ))}
    </SelectMultiple>
  )
}
