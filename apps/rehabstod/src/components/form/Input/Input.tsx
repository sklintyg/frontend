import { IDSInput } from '@inera/ids-react'
import type { ComponentProps, InputHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import type { IDSHtmlAttribute } from '../../../utils/IDSHtmlAttributes'
import { FormTooltip } from '../FormTooltip'

type InputProps = {
  label: string
  description?: string
}

export const Input = forwardRef<
  HTMLInputElement,
  IDSHtmlAttribute<InputHTMLAttributes<HTMLInputElement>, ComponentProps<typeof IDSInput>, InputProps>
>(({ id: controlledId, description, invalid = false, icon, label, light = false, ...props }, ref) => {
  const uncontrolledId = useId()
  const id = controlledId ?? uncontrolledId

  return (
    <IDSInput light={light} invalid={invalid} hasIcon={Boolean(icon)}>
      {label && <label htmlFor={id}>{label}</label>}
      {description && <FormTooltip>{description}</FormTooltip>}
      <input id={id} ref={ref} {...props} />
    </IDSInput>
  )
})

Input.displayName = 'Input'
