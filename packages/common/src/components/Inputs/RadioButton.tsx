import React, { ChangeEvent } from 'react'
import styled from 'styled-components'

interface Props {
  label: string
  id?: string
  name?: string
  value?: string | number | readonly string[] | undefined
  checked?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  hasValidationError?: boolean
  additionalStyles?: string
  disabled?: boolean
}

interface LabelProps {
  hasValidationError: boolean | undefined
}

const Label = styled.label<LabelProps>`
  &:before {
    border: ${(props) => (props.hasValidationError ? '1px solid #c12143 !important' : '')};
  }
`

const RadioButton: React.FC<Props> = (props) => {
  const { label, name, id, onChange, value, checked, additionalStyles, hasValidationError } = props

  return (
    <div>
      <input
        disabled={props.disabled}
        type="radio"
        id={id}
        name={name}
        className={`${additionalStyles} ic-forms__radio ${hasValidationError ? 'ic-forms__radio-error' : ''}`}
        value={value}
        onChange={(e) => onChange(e)}
        checked={checked}
      />
      <Label hasValidationError={hasValidationError} htmlFor={id}>
        {label}
      </Label>
    </div>
  )
}

export default RadioButton
