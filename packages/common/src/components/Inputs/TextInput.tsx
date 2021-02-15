import React, { ChangeEvent } from 'react'

interface Props {
  label?: string
  name?: string
  value?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  hasValidationError?: boolean
  disabled?: boolean
  placeholder?: string
  additionalStyles?: string
}

const TextInput: React.FC<Props> = (props) => {
  const { label, disabled, name, onChange, value, additionalStyles, hasValidationError, placeholder } = props
  return (
    <>
      {label ? <p>{label}</p> : ''}
      <input
        type="text"
        disabled={disabled}
        className={`ic-textfield ${additionalStyles} ${hasValidationError ? 'iu-color-error iu-border-error' : ''}`}
        name={name ?? ''}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e)}
      />
    </>
  )
}

export default TextInput
