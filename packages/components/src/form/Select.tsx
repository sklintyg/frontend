import { IDSIconQuestion, IDSSelect } from '@frontend/ids-react-ts'
import { forwardRef } from 'react'
import { TooltipIcon } from '../Tooltip'

interface SelectProps {
  label: string
  options?: { value: string; label: string }[]
  description?: string
  disabled?: boolean
  error?: boolean
}

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & SelectProps>(
  ({ children, id, label, description, disabled, options, ...props }, ref) => (
    <IDSSelect isDisabled={disabled}>
      <label htmlFor={id}>
        {label}
        {description && <TooltipIcon description={description} icon={<IDSIconQuestion size="s" className="relative top-1 ml-2" />} />}
      </label>
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
)

Select.displayName = 'Select'
