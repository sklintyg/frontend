import type React from 'react'
import type { ChangeEventHandler } from 'react'
import styled from 'styled-components'

interface Props {
  label: string
  id?: string
  name?: string
  value?: string | number | readonly string[]
  checked?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  hasValidationError?: boolean
  additionalStyles?: string
  disabled?: boolean
  wrapperAdditionalStyles?: string
  tooltip?: string
  tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left'
}

interface LabelProps {
  hasValidationError: boolean | undefined
}

const Label = styled.label<LabelProps>`
  &:before {
    border: ${(props) => (props.hasValidationError ? '1px solid #c12143 !important' : '')};
  }
`

const RadioButton: React.FC<Props> = ({
  label,
  name,
  id,
  onChange,
  value,
  checked,
  additionalStyles,
  hasValidationError,
  wrapperAdditionalStyles,
  children,
  tooltip,
  tooltipPlacement,
  disabled,
}) => {
  return (
    <div className={wrapperAdditionalStyles} data-tip={tooltip} data-place={tooltipPlacement}>
      <input
        disabled={disabled}
        type="radio"
        id={id}
        name={name}
        className={`${additionalStyles} ic-forms__radio ${hasValidationError ? 'ic-forms__radio-error' : ''}`}
        value={value}
        onChange={onChange}
        checked={checked}
      />
      <Label hasValidationError={hasValidationError} htmlFor={id}>
        {label} {children}
      </Label>
    </div>
  )
}

export default RadioButton
