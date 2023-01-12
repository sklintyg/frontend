import React from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  limit?: number
  error?: boolean
}

const TextInput = React.forwardRef<HTMLInputElement, Props>(({ label, id, limit, className, error, ...props }, ref) => (
  <>
    {label ? <label htmlFor={id}>{label}</label> : ''}
    <input
      ref={ref}
      className={`${error ? 'ic-textfield--error error' : ''} ic-textfield ${className}`}
      maxLength={limit ? limit : 3500}
      id={id ?? 'textinput'}
      {...props}
    />
  </>
))

export default TextInput
