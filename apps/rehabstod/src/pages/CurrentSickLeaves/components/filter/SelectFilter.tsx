import { IDSIconQuestion, IDSSelect } from '@frontend/ids-react-ts'
import { useId } from 'react'
import { Select } from '../../../../components/Form/Select'
import { TooltipIcon } from '../../../../components/TooltipIcon/TooltipIcon'

export function SelectFilter({
  onChange,
  options,
  description,
  value,
  label,
  hideDefaultValue,
}: {
  onChange: (option: string) => void
  options: { id: string; name: string }[]
  description: string
  value?: string
  label: string
  hideDefaultValue?: boolean
}) {
  const id = useId()

  return (
    <IDSSelect className="m-0">
      <label htmlFor={id}>
        {label}
        {description && <TooltipIcon description={description} icon={<IDSIconQuestion size="s" className="relative top-1 ml-2" />} />}
      </label>
      <Select id={id} value={value} onChange={(event) => onChange(event.currentTarget.value)}>
        {!hideDefaultValue && (
          <option className="ml-2" id="" value="">
            Visa alla
          </option>
        )}
        {options
          ? options.map((option) => (
              <option value={option.id} key={option.id}>
                {option.name}
              </option>
            ))
          : null}
      </Select>
    </IDSSelect>
  )
}
