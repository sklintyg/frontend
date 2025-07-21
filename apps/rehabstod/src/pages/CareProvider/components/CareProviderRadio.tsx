import { IDSRadio } from '@inera/ids-react'
import type { ChangeEventHandler, MouseEventHandler } from 'react'
import { InputLabel } from '../../../components/form/InputLabel/InputLabel'
import { classNames } from '../../../utils/classNames'

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
      <input type="radio" name="selectedUnit" value={value} id={id} checked={checked} onClick={onClick} onChange={onChange} />
      <InputLabel htmlFor={id} className={classNames(checked && 'font-bold')}>
        {label}
      </InputLabel>
    </IDSRadio>
  )
}
