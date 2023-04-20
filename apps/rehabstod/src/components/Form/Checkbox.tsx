import { IDSCheckbox } from '@frontend/ids-react-ts'
import { ChangeEvent } from 'react'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'

export function Checkbox({
  label,
  checked,
  onChange,
  description,
  id,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  description?: string
  id: string
  disabled?: boolean
}) {
  return (
    <IDSCheckbox>
      <label htmlFor={id} className="cursor-pointer">
        {label}
      </label>
      {description && <TooltipIcon description={description} name="question" size="s" className="ml-2" />}
      <input id={id} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
    </IDSCheckbox>
  )
}
