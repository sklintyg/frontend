import { IDSCheckbox } from '@frontend/ids-react-ts'
import { ChangeEvent } from 'react'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'

export function Checkbox({
  label,
  checked,
  onChange,
  description,
  id,
}: {
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  description?: string
  id: string
}) {
  return (
    <div className="flex items-baseline">
      <IDSCheckbox>
        <label htmlFor={id}>
          {label} {description && <TooltipIcon description={description} name="question" size="s" />}
        </label>
        <input id={id} type="checkbox" checked={checked} onChange={onChange} />
      </IDSCheckbox>
    </div>
  )
}
