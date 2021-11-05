import React, { ChangeEvent } from 'react'

interface Props {
  label?: string
  name?: string
  value?: string
  options: React.ReactNode
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  hasValidationError?: boolean
  disabled?: boolean
  id: string
}

const Dropdown: React.FC<Props> = (props) => {
  const { onChange, label, name, id, value, hasValidationError, options, disabled } = props
  return (
    <div className={`ic-forms__select ${hasValidationError ? 'iu-border-error' : ''} ${disabled ? 'ic-forms__select--disabled' : ''}`}>
      {label !== 'undefined' ? <label>{label}</label> : null}
      <select value={value} name={name} id={id} disabled={disabled} onChange={onChange}>
        {options}
      </select>
    </div>
  )
}

export default Dropdown
