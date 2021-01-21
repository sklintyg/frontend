import React, { ChangeEvent } from 'react'
import { FlattenSimpleInterpolation } from 'styled-components/macro'

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
        className={`${checkboxAdditionalStyles} ic-forms__checkbox ${hasValidationError ? 'iu-color-error' : ''}`}
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
