import { IDSCheckbox } from '@frontend/ids-react-ts'
import { ChangeEvent } from 'react'
import { Icon } from '../Icon/Icon'

export function Checkbox({
  label,
  checked,
  onChange,
  description,
}: {
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  description: string
}) {
  return (
    <div className="flex items-baseline">
      <IDSCheckbox>
        <label>{label}</label>
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event)} />
      </IDSCheckbox>
      {description && <Icon description={description} type="question" size="s" />}
    </div>
  )
}
