import { IDSInput } from '@frontend/ids-react-ts'
import { ChangeEvent, useId } from 'react'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'

export function NumberInput({
  label,
  onChange,
  onBlur,
  description,
  value,
  max,
  min,
  className,
  classNameInput,
  novalidation,
  isRange,
}: {
  label: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  description?: string
  value: number | string
  isRange?: boolean
  max?: number | string
  min?: number | string
  className?: string
  classNameInput?: string
  novalidation?: boolean
}) {
  const id = useId()
  return (
    <IDSInput className={`${isRange && 'flex items-baseline gap-3'} ${className}`} novalidation={novalidation}>
      <label htmlFor={id}>
        {label} {description && <TooltipIcon description={description} name="question" size="s" />}
      </label>
      <input
        type="number"
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        className={`border-accent-40 rounded border p-2 ${classNameInput}`}
        max={max}
        min={min}
        id={id}
      />
    </IDSInput>
  )
}
