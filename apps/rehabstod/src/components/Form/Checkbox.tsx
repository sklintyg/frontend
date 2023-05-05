import { IDSCheckbox } from '@frontend/ids-react-ts'
import { ChangeEvent, useId } from 'react'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'

export function Checkbox({
  label,
  checked,
  onChange,
  description,
  disabled,
  valid = 'true',
  compact = false,
  required = false,
}: {
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  description?: string
  disabled?: boolean
  valid?: 'true' | 'false'
  compact?: boolean
  required?: boolean
}) {
  const id = useId()

  return (
    <IDSCheckbox valid={valid} compact={compact}>
      <label htmlFor={id} className="cursor-pointer">
        {label}
      </label>
      {description && <TooltipIcon description={description} name="question" size="s" className="ml-2" />}
      <input id={id} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} required={required} />
    </IDSCheckbox>
  )
}
