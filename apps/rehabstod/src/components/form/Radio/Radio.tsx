import { IDSRadio } from '@inera/ids-react'
import type { ComponentProps, InputHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import type { IDSHtmlAttribute } from '../../../utils/IDSHtmlAttributes'
import { InputLabel } from '../InputLabel/InputLabel'

type RadioProps = {
  label: string
  description?: string
}

export const Radio = forwardRef<
  HTMLInputElement,
  IDSHtmlAttribute<InputHTMLAttributes<HTMLInputElement>, ComponentProps<typeof IDSRadio>, RadioProps>
>(({ id: controlledId, description, invalid = false, label, light = false, compact, ...props }, ref) => {
  const uncontrolledId = useId()
  const id = controlledId ?? uncontrolledId

  return (
    <IDSRadio light={light} invalid={invalid} compact={compact}>
      <input type="radio" ref={ref} {...props} />
      {label && (
        <InputLabel htmlFor={id} description={description}>
          {label}
        </InputLabel>
      )}
    </IDSRadio>
  )
})

Radio.displayName = 'Radio'
