import { Select } from '@frontend/components'
import { useId } from 'react'
import { PrintTitle } from '../print/PrintTitle'

export function SelectFilter({
  onChange,
  options,
  description,
  value,
  label,
  error,
  disabled = false,
}: {
  onChange: (option: string) => void
  options: { id: string; name: string }[]
  description: string
  value?: string
  label: string
  error?: boolean
  disabled?: boolean
}) {
  const id = useId()
  const chosenOption = options.find((option) => option.id === value)

  return (
    <>
      <Select
        id={id}
        label={label}
        description={description}
        disabled={disabled}
        options={options.map((opt) => ({ value: opt.id, label: opt.name }))}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      <div className="hidden print:block">
        <PrintTitle title={label} />
        {chosenOption ? chosenOption.name : '-'}
      </div>
    </>
  )
}
