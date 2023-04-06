import { IDSInput } from '@frontend/ids-react-ts'
import { ChangeEvent } from 'react'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'

export function NumberInput({
  label,
  onChange,
  description,
  id,
  value,
  isRange,
  max,
  min,
}: {
  label: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  description?: string
  id: string
  value: number
  isRange: boolean
  max: number
  min: number
}) {
  return (
    <IDSInput className={`${isRange && 'flex items-baseline gap-3'}`}>
      <label htmlFor={id}>
        {label} {description && <TooltipIcon description={description} name="question" size="s" />}
      </label>
      <input type="number" onChange={onChange} value={value} className="border-accent-40 rounded border p-2" max={max} min={min} />
    </IDSInput>
  )
}
