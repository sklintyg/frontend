import { Select } from '@frontend/components'
import { useId } from 'react'
import { PrintTitle } from '../print/PrintTitle'

export function SelectFilter({
  onChange,
  options,
  description,
  value,
  label,
  hideDefaultValue = false,
  disabled = false,
}: {
  onChange: (option: string) => void
  options: { id: string; name: string }[]
  description: string
  value?: string
  label: string
  hideDefaultValue?: boolean
  disabled?: boolean
}) {
  const id = useId()
  const chosenOption = options.find((option) => option.id === value)
  const opts = options.map((opt) => ({ value: opt.id, label: opt.name }))

  return (
    <>
      <Select
        id={id}
        label={label}
        value={value}
        description={description}
        disabled={disabled}
        options={hideDefaultValue ? opts : [{ value: '', label: 'Visa alla' }, ...opts]}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      <div className="hidden print:block">
        <PrintTitle title={label} />
        {chosenOption ? chosenOption.name : '-'}
      </div>
    </>
  )
}
