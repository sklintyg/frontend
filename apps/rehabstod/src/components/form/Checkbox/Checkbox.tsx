import { IDSCheckbox } from '@inera/ids-react'
import type { InputHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import { InputLabel } from '../InputLabel/InputLabel'

type Props = {
  label: string
  description?: string
  valid?: boolean
  light?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & Props>(
  ({ label, description, light, valid = true, ...props }, ref) => {
    const id = useId()

    return (
      <IDSCheckbox invalid={!valid} light={light}>
        <input id={id} ref={ref} type="checkbox" {...props} />
        <InputLabel htmlFor={id} description={description}>
          {label}
        </InputLabel>
      </IDSCheckbox>
    )
  }
)

Checkbox.displayName = 'Checkbox'
