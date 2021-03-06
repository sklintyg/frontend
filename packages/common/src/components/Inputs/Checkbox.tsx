import React, { ChangeEvent } from 'react'
import { FlattenSimpleInterpolation } from 'styled-components/macro'
import styled from 'styled-components'

interface Props {
  label?: string
  name?: string
  id?: string
  value?: string
  checked?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  hasValidationError?: boolean
  checkboxAdditionalStyles?: string
  vertical?: boolean
  disabled?: boolean
  wrapperStyles?: FlattenSimpleInterpolation
}

interface LabelProps {
  hasValidationError: boolean | undefined
}

const Label = styled.label<LabelProps>`
  &:before {
    border: ${(props) => (props.hasValidationError ? '1px solid #c12143 !important' : '')};
  }
`

const Checkbox: React.FC<Props> = (props) => {
  const {
    label,
    id,
    name,
    onChange,
    value,
    checked,
    checkboxAdditionalStyles,
    vertical,
    hasValidationError,
    disabled,
    wrapperStyles,
  } = props

  return (
    <div css={wrapperStyles}>
      <input
        type="checkbox"
        id={id}
        className={`ic-forms__checkbox ${checkboxAdditionalStyles ? checkboxAdditionalStyles : ''}`}
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
      <Label hasValidationError={hasValidationError} htmlFor={id} style={{ display: `${vertical} ? block : 'unset'` }}>
        {label}
      </Label>
    </div>
  )
}

export default Checkbox
