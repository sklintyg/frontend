import React, { ChangeEvent } from 'react'

interface Props {
  label?: string
  name?: string
  id: string
  value?: string
  checked?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  hasValidationError?: boolean
  checkboxAdditionalStyles?: string
  vertical?: boolean
  disabled?: boolean
}

const Checkbox: React.FC<Props> = (props) => {
  const { label, id, name, onChange, value, checked, checkboxAdditionalStyles, vertical, hasValidationError, disabled } = props

  return (
    <div>
      <input
        type="checkbox"
        id={id}
        className={`ic-forms__checkbox ${checkboxAdditionalStyles ? checkboxAdditionalStyles : ''} ${
          hasValidationError ? 'iu-color-error' : ''
        }`}
        style={{ color: `${hasValidationError ? `` : ''}` }}
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
      <label htmlFor={id} style={{ display: `${vertical} ? block : 'unset'` }}>
        {label}
      </label>
    </div>
  )
}

export default Checkbox
