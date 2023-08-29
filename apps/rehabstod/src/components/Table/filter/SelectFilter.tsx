import { IDSIconQuestion, IDSSelect } from '@frontend/ids-react-ts'
import { useId } from 'react'
import { Select } from '../../Form/Select'
import { TooltipIcon } from '../../TooltipIcon/TooltipIcon'
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

  const chosenOption = options ? options.find((option) => option.id === value) : undefined

  return (
    <>
      <div className="flex-1 print:hidden">
        <IDSSelect className="m-0" isDisabled={disabled}>
          <label htmlFor={id} className="mb-0">
            {label}
            {description && <TooltipIcon description={description} icon={<IDSIconQuestion size="s" className="relative top-1 ml-2" />} />}
          </label>
          <div className="relative">
            <Select value={value} id={id} onChange={(event) => onChange(event.currentTarget.value)} disabled={disabled}>
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
          </div>
        </IDSSelect>
      </div>

      <div className="hidden print:block">
        <PrintTitle title={label} />
        {chosenOption ? chosenOption.name : '-'}
      </div>
    </>
  )
}
