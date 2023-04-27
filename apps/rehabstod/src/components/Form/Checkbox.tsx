import { IDSCheckbox, IDSCheckboxElement } from '@frontend/ids-react-ts'
import { ChangeEvent, useEffect, useId, useRef } from 'react'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'

export function Checkbox({
  label,
  checked,
  onChange,
  description,
  disabled,
  compact,
}: {
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  description?: string
  disabled?: boolean
  compact?: boolean
}) {
  const id = useId()
  const ref = useRef<IDSCheckboxElement>(null)

  useEffect(() => {
    ref.current?.updateIsChecked()
  }, [checked])

  return (
    <IDSCheckbox ref={ref} compact={compact}>
      <label htmlFor={id} className="cursor-pointer">
        {label}
      </label>
      {description && <TooltipIcon description={description} name="question" size="s" className="ml-2" />}
      <input id={id} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
    </IDSCheckbox>
  )
}
