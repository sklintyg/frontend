import React from 'react'
import { FlattenSimpleInterpolation } from 'styled-components/macro'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  limit?: number
  error?: boolean
  css?: FlattenSimpleInterpolation
}

const TextInput = React.forwardRef<HTMLInputElement, Props>(({ label, id, limit, className, error, css, ...props }, ref) => (
  <>
    {label ? <label htmlFor={id}>{label}</label> : ''}
    <input
      ref={ref}
      className={`${error ? 'ic-textfield--error error' : ''} ic-textfield ${className}`}
      maxLength={limit ? limit : 3500}
      id={id ?? 'textinput'}
      css={css}
      {...props}
    />
  </>
))

export default TextInput
