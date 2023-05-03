import { IDSCheckbox, IDSErrorMessage } from '@frontend/ids-react-ts'
import { ChangeEvent, useId } from 'react'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'

export function Checkbox({
  label,
  checked,
  onChange,
  description,
  disabled,
  className,
  valid = 'true',
  errorMessage,
  compact = false,
  required = false,
}: {
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  description?: string
  disabled?: boolean
  className?: string
  valid?: 'true' | 'false'
  errorMessage?: string
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
      <input id={id} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className={className} required={required} />
      <IDSErrorMessage>{errorMessage}</IDSErrorMessage>
    </IDSCheckbox>
  )
}
