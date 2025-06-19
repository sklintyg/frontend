import { IDSSelect } from '@inera/ids-react'
import type { ComponentProps, OptionHTMLAttributes, SelectHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import type { IDSHtmlAttribute } from '../../../utils/IDSHtmlAttributes'
import { FormTooltip } from '../FormTooltip'

type SelectOption = {
  value: OptionHTMLAttributes<HTMLOptionElement>['value']
  label: string
}

type SelectProps = {
  label: string
  options?: SelectOption[]
  description?: string
  disabled?: boolean
  defaultOption?: SelectOption
  light?: boolean
}

export const Select = forwardRef<
  HTMLSelectElement,
  IDSHtmlAttribute<SelectHTMLAttributes<HTMLSelectElement>, ComponentProps<typeof IDSSelect>, SelectProps>
>(({ id: controlledId, invalid, light, nooptiondescriber, novalidation, srof, slot, label, description, options, ...props }, ref) => {
  const uncontrolledId = useId()
  const id = controlledId ?? uncontrolledId

  return (
    <IDSSelect
      invalid={invalid}
      light={light}
      nooptiondescriber={nooptiondescriber}
      novalidation={novalidation}
      srof={srof || 'av'}
      slot={slot}
    >
      {label && <label htmlFor={id}>{label}</label>}
      {description && <FormTooltip>{description}</FormTooltip>}
      <select id={id} ref={ref} {...props}>
        {options?.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </IDSSelect>
  )
})

Select.displayName = 'Select'
