import React, { ChangeEvent } from 'react'
import { FlattenSimpleInterpolation } from 'styled-components/macro'
import { css } from 'styled-components'

interface Props {
  expanded?: boolean
  label?: string
  name?: string
  value?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: any
  hasValidationError?: boolean
  disabled?: boolean
  placeholder?: string
  additionalStyles?: FlattenSimpleInterpolation
}

const TextInput: React.FC<Props> = (props) => {
  const { expanded, label, disabled, name, onChange, value, additionalStyles, hasValidationError, placeholder, onBlur } = props
  return (
    <>
      {label ? <p>{label}</p> : ''}
      <input
        aria-expanded={expanded}
        css={additionalStyles}
        type="text"
        disabled={disabled}
        className={`${hasValidationError ? 'iu-color-error iu-border-error' : ''} ic-textfield`}
        name={name ?? ''}
        placeholder={placeholder}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e)}
      />
    </>
  )
}

export default TextInput
