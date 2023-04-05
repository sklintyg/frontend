import { IDSRadio } from '@frontend/ids-react-ts'
import { ChangeEventHandler, MouseEventHandler } from 'react'

export function Radio({
  name,
  value,
  id,
  onChange,
  onClick,
}: {
  name: string
  value: string
  id: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  onClick?: MouseEventHandler<HTMLInputElement>
}) {
  return (
    <IDSRadio>
      <input type="radio" name={name} value={value} id={id} onClick={onClick} onChange={onChange} />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor={id} />
    </IDSRadio>
  )
}
