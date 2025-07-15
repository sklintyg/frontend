import { IDSCheckbox } from '@inera/ids-react'
import type { ChangeEvent } from 'react'
import { useId, useRef } from 'react'
import { InputLabel } from './InputLabel/InputLabel'

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
  const ref = useRef(null)

  return (
    <IDSCheckbox ref={ref} invalid={!valid} light={light}>
      <input id={id} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} required={required} />
      <InputLabel htmlFor={id} description={description}>
        {label}
      </InputLabel>
    </IDSCheckbox>
  )
}
