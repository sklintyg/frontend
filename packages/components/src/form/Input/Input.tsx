import type { ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import { classNames } from '../../utils/classNames'
import { InputLabel } from '../InputLabel/InputLabel'

type InputProps = {
  label: ReactNode
  description?: string
  inline?: boolean
  light?: boolean
  invalid?: boolean
}

export const Input = forwardRef(
  (
    {
      id: controlledId,
      disabled,
      label,
      description,
      inline,
      className,
      light,
      invalid,
      ...props
    }: InputHTMLAttributes<HTMLInputElement> & InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const uncontrolledId = useId()
    const id = controlledId ?? uncontrolledId

    return (
      <div className={classNames(inline && 'flex flex-row grow gap-1 place-items-center ')}>
        {label !== '' && (
          <InputLabel htmlFor={id} description={description} inline={inline}>
            {label}
          </InputLabel>
        )}
        <input
          id={id}
          ref={ref}
          disabled={disabled}
          className={classNames('ids-input', light && 'ids-input--light', invalid && 'ids-input--invalid', className)}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'
