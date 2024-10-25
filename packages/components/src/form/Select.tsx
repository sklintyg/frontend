import { IDSSelect } from '@frontend/ids-react-ts'
import type { OptionHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import { InputLabel } from './InputLabel'

interface SelectOption {
  value: OptionHTMLAttributes<HTMLOptionElement>['value']
  label: string
}

interface SelectProps {
  label: string
  options?: SelectOption[]
  description?: string
  disabled?: boolean
  defaultOption?: SelectOption
  light?: boolean
}

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & SelectProps>(
  ({ children, id: controlledId, label, description, disabled, light, options, defaultOption, ...props }, ref) => {
    const uncontrolledId = useId()
    const id = controlledId ?? uncontrolledId

    return (
      <IDSSelect light={light} isDisabled={disabled} className="my-0">
        {label && (
          <InputLabel htmlFor={id} description={description}>
            {label}
          </InputLabel>
        )}
        <select ref={ref} id={id} disabled={disabled} {...props}>
          {defaultOption && (
            <option key={`${defaultOption.label}_${defaultOption.value}`} value={defaultOption.value}>
              {defaultOption.label}
            </option>
          )}
          {options?.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
      </IDSSelect>
    )
  }
)

Select.displayName = 'Select'
