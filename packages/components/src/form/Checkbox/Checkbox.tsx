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
  ({ label, description, light, invalid, disabled, ...props }, ref) => {
    const id = useId()

    return (
      <div className={classNames('ids-checkbox', light && 'ids-checkbox--light')}>
        <input id={id} ref={ref} type="checkbox" className={classNames(invalid && 'ids-input--invalid')} {...props} />
        <InputLabel htmlFor={id} description={description} disabled={disabled} className="ids-label--clickable">
          {label}
        </InputLabel>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
