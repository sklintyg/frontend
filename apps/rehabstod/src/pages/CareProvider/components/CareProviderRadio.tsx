import { InputLabel, classNames } from '@frontend/components'
import { IDSRadio } from '@inera/ids-react'
import type { ChangeEventHandler, MouseEventHandler } from 'react'

export function CareProviderRadioButton({
  id,
  value,
  label,
  checked,
  onChange,
  onClick,
}: {
  id: string
  value: string
  checked: boolean
  label: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onClick?: MouseEventHandler<HTMLInputElement>
}) {
  return (
    <IDSRadio light>
      <IDSInput type="radio" name="selectedUnit" value={value} id={id} checked={checked} onClick={onClick} onChange={onChange} />
      <InputLabel htmlFor={id} className={classNames(checked && 'font-bold')}>
        {label}
      </InputLabel>
    </IDSRadio>
  )
}
