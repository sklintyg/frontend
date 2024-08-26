import React from 'react'
import type { FlattenSimpleInterpolation } from 'styled-components'
import styled from 'styled-components'
import { questionImage } from '../../images'

const Icon = styled.img`
  width: 14px;
  display: inline-block;
`

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  limit?: number
  hasValidationError?: boolean
  css?: FlattenSimpleInterpolation
  tooltip?: string
}

const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, id, limit, className, hasValidationError, css, autoComplete, tooltip, ...props }, ref) => (
    <div>
      {label && (
        <>
          <label htmlFor={id}>{label}</label> {tooltip && <Icon src={questionImage} data-tip={tooltip} alt={tooltip} />}
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
