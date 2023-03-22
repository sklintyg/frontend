import { IDSCheckbox } from '@frontend/ids-react-ts'
import { ChangeEvent } from 'react'

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <IDSCheckbox>
      <label>{label}</label>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event)} />
    </IDSCheckbox>
  )
}
