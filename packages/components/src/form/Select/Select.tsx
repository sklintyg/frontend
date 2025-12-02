import type { IDSSelect } from '@inera/ids-react'
import type { ComponentProps, OptionHTMLAttributes, SelectHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import { classNames } from '../../utils/classNames'
import type { IDSHtmlAttribute } from '../../utils/IDSHtmlAttributes'
import { InputLabel } from '../InputLabel/InputLabel'

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
  inline?: boolean
}

export const Select = forwardRef<
  HTMLSelectElement,
  IDSHtmlAttribute<SelectHTMLAttributes<HTMLSelectElement>, ComponentProps<typeof IDSSelect>, SelectProps>
>(({ id: controlledId, inline, invalid, light, label, description, options, className, ...props }, ref) => {
  const uncontrolledId = useId()
  const id = controlledId ?? uncontrolledId

  return (
    <div className={classNames(inline && 'flex flex-col item-center')}>
      <InputLabel htmlFor={id} description={description}>
        {label}
      </InputLabel>
      <div className="ids-select-wrapper">
        <select
          ref={ref}
          id={id}
          className={classNames('ids-select', light && 'ids-input--light', invalid && 'ids-input--invalid', className)}
          {...props}
        >
          {options?.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
})

Select.displayName = 'Select'
