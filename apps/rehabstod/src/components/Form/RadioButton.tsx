import { TooltipIcon } from 'components'
import { IDSIconQuestion, IDSRadio } from 'ids-react-ts'
import type { ChangeEvent } from 'react'
import { useId } from 'react'

export function RadioButton({
  label,
  checked,
  onChange,
  description,
  disabled,
  value,
  light = false,
}: {
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  description?: string
  disabled?: boolean
  value: string
  light?: boolean
}) {
  const id = useId()

  return (
    <IDSRadio light={light}>
      {description && <TooltipIcon description={description} icon={<IDSIconQuestion size="s" className="ml-2" />} />}
      <input id={id} type="radio" checked={checked} onChange={onChange} disabled={disabled} value={value} />
      <label htmlFor={id} className="cursor-pointer">
        {label}
      </label>
    </IDSRadio>
  )
}
