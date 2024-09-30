import { classNames } from 'components'
import { IDSRadio } from 'ids-react-ts'
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
    <IDSRadio>
      <input type="radio" name="selectedUnit" value={value} id={id} checked={checked} onClick={onClick} onChange={onChange} />
      <label htmlFor={id} className={classNames('ids-label ids-label--radio', checked && 'font-bold')}>
        <span>{label}</span>
      </label>
    </IDSRadio>
  )
}
