import React from 'react'
import { FlattenSimpleInterpolation } from 'styled-components'
import { InfoCircle } from '../../images'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  limit?: number
  hasValidationError?: boolean
  css?: FlattenSimpleInterpolation
  tooltip?: string
}

const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, id, limit, className, hasValidationError, css, autoComplete, tooltip, tooltipPlacement, ...props }, ref) => (
    <div>
      {label && (
        <>
          <label htmlFor={id}>{label}</label> {tooltip && <InfoCircle tooltip={tooltip} />}
        </>
      )}
      <input
        ref={ref}
        className={`${hasValidationError ? 'ic-textfield--error error' : ''} ic-textfield ${className}`}
        maxLength={limit ? limit : 3500}
        autoComplete={autoComplete ?? 'off'}
        id={id ?? 'textinput'}
        css={css}
        {...props}
      />
    </div>
  )
)

export default TextInput
