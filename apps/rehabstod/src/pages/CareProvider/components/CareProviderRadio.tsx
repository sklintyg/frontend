import { IDSRadio } from '@inera/ids-react'
import type { ChangeEventHandler, MouseEventHandler } from 'react'
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
    <IDSRadio>
      <input type="radio" name="selectedUnit" value={value} id={id} checked={checked} onClick={onClick} onChange={onChange} />
      <label htmlFor={id} className={classNames('ids-label ids-label--radio', checked && 'font-bold')}>
        <span>{label}</span>
      </label>
    </IDSRadio>
  )
}
