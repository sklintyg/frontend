import { ChangeEvent, ClipboardEventHandler, KeyboardEventHandler, ReactEventHandler, useId } from 'react'
import { classNames } from '../../utils/classNames'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'
import { Input } from './Input'

export function NumberInput({
  label,
  onChange,
  onBlur,
  onKeyDown,
  onPaste,
  description,
  value,
  max,
  min,
  error,
  inline = false,
}: {
  label: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: ReactEventHandler<HTMLInputElement>
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
  onPaste?: ClipboardEventHandler<HTMLInputElement>
  description?: string
  value: number | string
  inline?: boolean
  max?: number | string
  min?: number | string
  error?: boolean
}) {
  const id = useId()
  return (
    <div className={classNames(inline && 'flex items-baseline gap-3', 'w-full')}>
      <label htmlFor={id}>
        {label} {description && <TooltipIcon description={description} name="question" size="s" />}
      </label>
      <Input
        type="number"
        error={error}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        value={value}
        max={max}
        min={min}
        id={id}
      />
    </div>
  )
}
