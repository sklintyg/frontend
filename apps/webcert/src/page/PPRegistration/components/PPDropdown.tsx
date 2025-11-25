import { classNames } from '@frontend/components'
import type { ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import { FieldLabel } from '../../../components/Inputs/FieldLabel'

interface PPDropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  hasError?: boolean
  tooltip?: ReactNode
  children: ReactNode
  fullWidth?: boolean
  required?: boolean
  hasValidationError?: boolean
}

const PPDropdown = forwardRef<HTMLSelectElement, PPDropdownProps>(
  ({ label, tooltip, children, hasValidationError = false, disabled, className, required, ...props }, ref) => {
    const id = useId()

    return (
      <div className="flex flex-col gap-1">
        <FieldLabel id={id} label={label} tooltip={tooltip} required={required} />
        <div
          className={classNames(
            'ic-forms__select dropdown relative w-full max-w-none',
            hasValidationError && 'iu-border-error',
            disabled && 'ic-forms__select--disabled'
          )}
        >
          <select
            ref={ref}
            id={id}
            className={`
              ${className || ''}
            `}
            disabled={disabled}
            required={required}
            {...props}
          >
            {children}
          </select>
        </div>
      </div>
    )
  }
)

PPDropdown.displayName = 'PPDropdown'

export default PPDropdown
