import { IDSInput } from '@inera/ids-react'
import type { ComponentProps, InputHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import { classNames } from '../../../utils/classNames'
import type { IDSHtmlAttribute } from '../../../utils/IDSHtmlAttributes'
import { FormTooltip } from '../FormTooltip'

type InputProps = {
  label: string
  description?: string
  inline?: boolean
}

export const Input = forwardRef<
  HTMLInputElement,
  IDSHtmlAttribute<InputHTMLAttributes<HTMLInputElement>, ComponentProps<typeof IDSInput>, InputProps>
>(({ id: controlledId, description, invalid = false, icon, label, light = false, inline, ...props }, ref) => {
  const uncontrolledId = useId()
  const id = controlledId ?? uncontrolledId

  return (
    <IDSInput light={light} invalid={invalid} hasIcon={Boolean(icon)}>
      <div className={classNames(inline && 'flex items-center')}>
        {label && (
          <label htmlFor={id} className={classNames(inline && 'mr-1')}>
            {label}
          </label>
        )}
        {description && <FormTooltip>{description}</FormTooltip>}
        <input id={id} ref={ref} {...props} />
      </div>
    </IDSInput>
  )
})

Input.displayName = 'Input'
