import { IDSRadio } from '@frontend/ids-react-ts'
import { ChangeEvent, useId } from 'react'
import { TooltipIcon } from '../TooltipIcon/TooltipIcon'

export function RadioButton({
  label,
  checked,
  onChange,
  description,
  disabled,
  value,
}: {
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  description?: string
  disabled?: boolean
  value: string
}) {
  const id = useId()

  return (
    <IDSRadio>
      {description && <TooltipIcon description={description} name="question" size="s" className="ml-2" />}
      <input id={id} type="radio" checked={checked} onChange={onChange} disabled={disabled} value={value} />
      <label htmlFor={id} className="cursor-pointer">
        {label}
      </label>
    </IDSRadio>
  )
}
