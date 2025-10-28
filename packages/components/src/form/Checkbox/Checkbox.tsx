import type { InputHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import { classNames } from '../../utils/classNames'
import { InputLabel } from '../InputLabel/InputLabel'

type Props = {
  label: string
  description?: string
  invalid?: boolean
  light?: boolean
  disabled?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & Props>(
  ({ label, description, light, invalid, disabled, checked, role, ...props }, ref) => {
    const id = useId()

    return (
      <div
        className={classNames('ids-checkbox', light && 'ids-checkbox--light')}
        role={role}
        aria-selected={role === 'option' && checked}
        aria-checked={role === 'option' && checked}
      >
        <input id={id} ref={ref} type="checkbox" className={classNames(invalid && 'ids-input--invalid')} checked={checked} {...props} />
        <InputLabel htmlFor={id} description={description} disabled={disabled} className="ids-label--clickable">
          {label}
        </InputLabel>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
