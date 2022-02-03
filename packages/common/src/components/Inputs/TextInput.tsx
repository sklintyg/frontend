import React, { ChangeEvent } from "react";
import { FlattenSimpleInterpolation } from "styled-components/macro";

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
  activeDescendant?: string
  limit?: number
}

const TextInput: React.FC<Props & { ref: React.Ref<HTMLInputElement> }> = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
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
    activeDescendant,
    limit,
  } = props
  return (
    <>
      {label ? <p>{label}</p> : ''}
      <input
        ref={ref}
        aria-expanded={expanded}
        css={additionalStyles}
        type="text"
        disabled={disabled}
        className={`${hasValidationError ? 'ic-textfield--error' : ''} ic-textfield`}
        name={name ?? ''}
        placeholder={placeholder}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e)}
        aria-activedescendant={activeDescendant}
        maxLength={limit ? limit : 3500}
      />
    </>
  )
})

export default TextInput;
