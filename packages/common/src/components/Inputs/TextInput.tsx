import React, { ChangeEvent } from 'react'
import { FlattenSimpleInterpolation } from 'styled-components/macro'
import styled from 'styled-components'

interface Props {
  expanded?: boolean
  label?: string
  name?: string
  value?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  onFocus?: () => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  hasValidationError?: boolean
  disabled?: boolean
  placeholder?: string
  additionalStyles?: FlattenSimpleInterpolation
  activeDescendant?: string
  limit?: number
  id?: string
  autoComplete?: boolean
  className?: string
  testId?: string
}

const Input = styled.input`
  &:focus-within {
    box-shadow: 0 0 0.9375rem 0 rgb(27 27 27 / 40%);
  }
`

const TextInput: React.FC<Props & { ref?: React.Ref<HTMLInputElement> }> = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    expanded,
    label,
    disabled,
    name,
    onChange,
    value,
    additionalStyles,
    hasValidationError,
    placeholder,
    onBlur,
    onFocus,
    onKeyDown,
    activeDescendant,
    limit,
    id,
    className,
    testId,
  } = props
  return (
    <>
      {label ? <label htmlFor={id}>{label}</label> : ''}
      <Input
        ref={ref}
        aria-expanded={expanded}
        css={additionalStyles}
        type="text"
        disabled={disabled}
        className={`${hasValidationError ? 'ic-textfield--error error' : ''} ic-textfield ${className}`}
        name={name ?? ''}
        placeholder={placeholder}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        onKeyDown={onKeyDown}
        aria-activedescendant={activeDescendant}
        maxLength={limit ? limit : 3500}
        id={id ?? 'textinput'}
        autoComplete={props.autoComplete ? 'on' : 'off'}
        data-testid={testId}
      />
    </>
  )
})

export default TextInput
