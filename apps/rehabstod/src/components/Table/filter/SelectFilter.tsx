import { Select } from '../../form/Select/Select'
import { PrintTitle } from '../print/PrintTitle'

export function SelectFilter({
  onChange,
  options,
  description,
  value,
  label,
  disabled = false,
}: {
  onChange: (option: string) => void
  options: { id: string; name: string }[]
  description: string
  value?: string | number
  label: string
  disabled?: boolean
}) {
  const chosenOption = options.find((option) => option.id === value)

  return (
    <>
      <div className="print:hidden">
        <Select
          light
          label={label}
          value={value}
          description={description}
          disabled={disabled}
          options={[{ value: '', label: 'Visa alla' }, ...options.map((opt) => ({ value: opt.id, label: opt.name }))]}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      </div>
      <div className="hidden print:block">
        <PrintTitle title={label} />
        {chosenOption ? chosenOption.name : '-'}
      </div>
    </>
  )
}
