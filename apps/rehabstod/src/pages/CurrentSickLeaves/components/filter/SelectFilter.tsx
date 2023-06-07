import { useId } from 'react'
import { Checkbox } from '../../../../components/Form/Checkbox'
import { SelectMultiple } from '../../../../components/Form/SelectMultiple'
import { OccupationType, RekoStatusType } from '../../../../schemas/sickLeaveSchema'
import { Select } from '../../../../components/Form/Select'

export function SelectFilter({
  onChange,
  options,
  description,
  label,
  placeholder,
}: {
  onChange: (option: string) => void
  options: { id: string; name: string }[]
  description: string
  label: string
  placeholder: string
}) {
  const id = useId()

  return (
    <div className="flex-1">
      <label htmlFor={id}>Välj enhet</label>
      <Select id={id} placeholder={placeholder}>
        {options ? options.map((option) => <option key={option.id} label={option.name} onChange={() => onChange(option.id)} />) : null}
      </Select>
    </div>
  )
}
