import { TooltipIcon } from 'components'
import type { IDSCheckboxElement } from 'ids-react-ts'
import { IDSCheckbox, IDSIconQuestion } from 'ids-react-ts'
import type { ChangeEvent } from 'react'
import { useId, useRef } from 'react'

export function Checkbox({
  label,
  checked,
  onChange,
  description,
  disabled,
  valid = 'true',
  required = false,
  light = false,
}: {
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  description?: string
  disabled?: boolean
  valid?: 'true' | 'false'
  required?: boolean
  light?: boolean
}) {
  const id = useId()
  const ref = useRef<IDSCheckboxElement>(null)

  return (
    <IDSCheckbox ref={ref} invalid={!valid} light={light}>
      {description && <TooltipIcon description={description} icon={<IDSIconQuestion size="s" className="ml-2" />} />}
      <input id={id} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} required={required} />
      <label htmlFor={id} className="cursor-pointer">
        {label}
      </label>
    </IDSCheckbox>
  )
}
