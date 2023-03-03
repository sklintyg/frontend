import React from 'react'
import { FlattenSimpleInterpolation } from 'styled-components'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  limit?: number
  hasValidationError?: boolean
  css?: FlattenSimpleInterpolation
}

const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, id, limit, className, hasValidationError, css, autoComplete, ...props }, ref) => (
    <>
      {label ? <label htmlFor={id}>{label}</label> : ''}
      <input
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
