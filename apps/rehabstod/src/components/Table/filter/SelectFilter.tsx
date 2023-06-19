import { IDSIconQuestion, IDSSelect } from '@frontend/ids-react-ts'
import { useId } from 'react'
import { Select } from '../../Form/Select'
import { TooltipIcon } from '../../TooltipIcon/TooltipIcon'

export function SelectFilter({
  onChange,
  options,
  description,
  label,
}: {
  onChange: (option: string) => void
  options: { id: string; name: string }[]
  description: string
  label: string
}) {
  const id = useId()

  return (
    <div className="flex-1 print:hidden">
      <IDSSelect className="m-0">
        <label htmlFor={id}>
          {label}
          {description && <TooltipIcon description={description} icon={<IDSIconQuestion size="s" className="relative top-1 ml-2" />} />}
        </label>
        <Select id={id} onChange={(event) => onChange(event.currentTarget.value)}>
          <option className="ml-2" id="" value="">
            Visa alla
          </option>
          {options ? options.map((option) => <option value={option.id} key={option.id} label={option.name} />) : null}
        </Select>
      </IDSSelect>
    </div>
  )
}