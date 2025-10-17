/* eslint-disable jsx-a11y/role-supports-aria-props */
import type { IDSRadio } from '@inera/ids-react'
import type { ComponentProps, InputHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import { classNames } from '../../utils/classNames'
import type { IDSHtmlAttribute } from '../../utils/IDSHtmlAttributes'
import { InputLabel } from '../InputLabel/InputLabel'

type RadioProps = {
  label: string
  description?: string
}

export const Radio = forwardRef<
  HTMLInputElement,
  IDSHtmlAttribute<InputHTMLAttributes<HTMLInputElement>, ComponentProps<typeof IDSRadio>, RadioProps>
>(({ id: controlledId, description, disabled, invalid = false, label, light = false, className, ...props }, ref) => {
  const uncontrolledId = useId()
  const id = controlledId ?? uncontrolledId

  return (
    <div className="ids-radio">
      <input
        ref={ref}
        id={id}
        type="radio"
        aria-invalid={invalid}
        disabled={disabled}
        className={classNames(light && 'ids-input--light', className)}
        {...props}
      />
      <InputLabel htmlFor={id} description={description} disabled={disabled} className="ids-label--clickable">
        {label}
      </InputLabel>
    </div>
  )
})

Radio.displayName = 'Radio'
