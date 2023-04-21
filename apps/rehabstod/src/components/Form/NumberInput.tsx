import { ChangeEvent, useId } from 'react'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'
import { Input } from './Input'

export function NumberInput({
  label,
  onChange,
  description,
  value,
  max,
  min,
}: {
  label: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  description?: string
  value: number
  max: number
  min: number
}) {
  const id = useId()
  return (
    <div className="flex w-full items-baseline gap-3">
      <label htmlFor={id}>
        {label} {description && <TooltipIcon description={description} name="question" size="s" />}
      </label>
      <Input id={id} type="number" onChange={onChange} value={value} max={max} min={min} />
    </div>
  )
}
