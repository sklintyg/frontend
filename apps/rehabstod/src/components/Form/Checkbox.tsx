import { TooltipIcon } from '@frontend/components'
import type { IDSCheckboxElement } from '@frontend/ids-react-ts'
import { IDSCheckbox, IDSIconQuestion } from '@frontend/ids-react-ts'
import type { ChangeEvent } from 'react'
import { useEffect, useId, useRef } from 'react'

export function Checkbox({
  label,
  checked,
  onChange,
  description,
  disabled,
  valid = 'true',
  compact = false,
  required = false,
  light = false,
}: {
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  description?: string
  disabled?: boolean
  valid?: 'true' | 'false'
  compact?: boolean
  required?: boolean
  light?: boolean
}) {
  const id = useId()
  const ref = useRef<IDSCheckboxElement>(null)

  useEffect(() => {
    ref.current?.updateIsChecked()
  }, [checked])

  return (
    <IDSCheckbox ref={ref} valid={valid} compact={compact} light={light}>
      <label htmlFor={id} className="cursor-pointer">
        {label}
      </label>
      {description && <TooltipIcon description={description} icon={<IDSIconQuestion size="s" className="ml-2" />} />}
      <input id={id} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} required={required} />
    </IDSCheckbox>
  )
}
