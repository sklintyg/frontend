import { Select, classNames, useInputStyle } from '@frontend/components'
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
  const style = useInputStyle({ error, disabled })

  return (
    <>
      {/* <div className="flex-1 print:hidden">
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
              {options.map((option) => (
                <option value={option.id} key={option.id}>
                  {option.name}
                </option>
              ))}
            </Select>
          </div>
        </IDSSelect>
      </div> */}
      <Select
        id={id}
        label={label}
        description={description}
        disabled={disabled}
        className={classNames(style, 'py-3', 'appearance-none', 'pl-5 pr-12')}
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
