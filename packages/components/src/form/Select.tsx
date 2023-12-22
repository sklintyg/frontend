import { IDSSelect } from '@frontend/ids-react-ts'
import { forwardRef, useId } from 'react'
import { InputLabel } from './InputLabel'

interface SelectProps {
  label: string
  options?: { value: string; label: string }[]
  description?: string
  disabled?: boolean
}

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & SelectProps>(
  ({ children, id: controlledId, label, description, disabled, options, ...props }, ref) => {
    const uncontrolledId = useId()
    const id = controlledId ?? uncontrolledId

    return (
      <IDSSelect isDisabled={disabled} className="my-0">
        {label && (
          <InputLabel htmlFor={id} description={description}>
            {label}
          </InputLabel>
        )}
        <select ref={ref} id={id} disabled={disabled} {...props}>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
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
