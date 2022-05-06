import React, { ChangeEvent } from 'react'
import { FlattenSimpleInterpolation } from 'styled-components/macro'

interface Props {
  expanded?: boolean
  label?: string
  name?: string
  value?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  onFocus?: () => void
  hasValidationError?: boolean
  disabled?: boolean
  placeholder?: string
  additionalStyles?: FlattenSimpleInterpolation
  activeDescendant?: string
  limit?: number
  id?: string
  autocomplete?: boolean
}

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
    activeDescendant,
    limit,
    id,
  } = props
  return (
    <>
      {label ? <label htmlFor={id}>{label}</label> : ''}
      <input
        ref={ref}
        aria-expanded={expanded}
        css={additionalStyles}
        type="text"
        disabled={disabled}
        className={`${hasValidationError ? 'ic-textfield--error error' : ''} ic-textfield`}
        name={name ?? ''}
        placeholder={placeholder}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        aria-activedescendant={activeDescendant}
        maxLength={limit ? limit : 3500}
        id={id ?? 'textinput'}
        autoComplete={props.autocomplete ? 'on' : 'off'}
      />
    </>
  )
})

export default TextInput
