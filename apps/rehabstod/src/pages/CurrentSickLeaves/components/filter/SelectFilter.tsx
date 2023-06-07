import { useId } from 'react'
import { Select } from '../../../../components/Form/Select'
import { TooltipIcon } from '../../../../components/TooltipIcon/TooltipIcon'
import { IDSSelect } from '@frontend/ids-react-ts'

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
      <IDSSelect className="m-0">
        <label htmlFor={id}>
          {label}
          {description && <TooltipIcon description={description} name="question" size="s" className="relative top-1 ml-2" />}
        </label>
        <Select id={id} placeholder={placeholder}>
          <option className="ml-2" value="Ingen förvald enhet">
            Visa alla
          </option>
          {options ? options.map((option) => <option key={option.id} label={option.name} onChange={() => onChange(option.id)} />) : null}
        </Select>
      </IDSSelect>
    </div>
  )
}
