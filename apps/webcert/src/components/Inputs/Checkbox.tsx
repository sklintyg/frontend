import type { ChangeEvent } from 'react'
import type React from 'react'
import styled from 'styled-components'

interface Props {
  label?: string
  name?: string
  id?: string
  value?: string
  checked?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  hasValidationError?: boolean
  checkboxAdditionalStyles?: string
  vertical?: boolean
  disabled?: boolean
  wrapperAdditionalStyles?: string
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
    onFocus,
    value,
    checked,
    checkboxAdditionalStyles,
    vertical,
    hasValidationError,
    disabled,
    wrapperAdditionalStyles,
  } = props

  return (
    <div className={wrapperAdditionalStyles}>
      <input
        data-testid={id}
        type="checkbox"
        id={'checkbox_' + id}
        className={`ic-forms__checkbox ${checkboxAdditionalStyles ? checkboxAdditionalStyles : ''}`}
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        onFocus={onFocus}
      />
      <Label hasValidationError={hasValidationError} htmlFor={'checkbox_' + id} style={{ display: `${vertical} ? block : 'unset'` }}>
        {label}
      </Label>
    </div>
  )
}

export default Checkbox
