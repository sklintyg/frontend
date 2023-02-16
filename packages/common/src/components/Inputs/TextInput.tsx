import React from 'react'
import styled, { FlattenSimpleInterpolation } from 'styled-components'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  limit?: number
  hasValidationError?: boolean
  css?: FlattenSimpleInterpolation
}

const Input = styled.input`
  &:focus-within {
    box-shadow: 0 0 0.9375rem 0 rgb(27 27 27 / 40%);
  }
`

const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, id, limit, className, hasValidationError, css, autoComplete, ...props }, ref) => (
    <>
      {label ? <label htmlFor={id}>{label}</label> : ''}
      <Input
        ref={ref}
        className={`${hasValidationError ? 'ic-textfield--error error' : ''} ic-textfield ${className}`}
        maxLength={limit ? limit : 3500}
        autoComplete={autoComplete ?? 'off'}
        id={id ?? 'textinput'}
        css={css}
        {...props}
      />
    </>
  )
)

export default TextInput
